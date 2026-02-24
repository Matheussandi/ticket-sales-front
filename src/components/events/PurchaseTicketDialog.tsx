import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Event } from "@/domain/entities/Event";
import { usePurchaseTickets } from "@/hooks/mutations/usePurchaseTickets";
import { useTicketsByEvent } from "@/hooks/queries/useTicketsByEvent";

// Schema para o formulário de compra
const purchaseFormSchema = z.object({
	quantity: z
		.string()
		.min(1, "Selecione pelo menos 1 ticket")
		.transform((val) => Number(val)),
	card_token: z.string().min(1, "Selecione um método de pagamento"),
});

type PurchaseFormData = z.infer<typeof purchaseFormSchema>;

interface PurchaseTicketDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: Event;
}

// Opções de métodos de pagamento (tokens mock)
const PAYMENT_METHODS = [
	{ value: "tok_visa", label: "Visa •••• 4242" },
	{ value: "tok_mastercard", label: "Mastercard •••• 5555" },
	{ value: "tok_amex", label: "American Express •••• 0005" },
];

export function PurchaseTicketDialog({
	open,
	onOpenChange,
	event,
}: PurchaseTicketDialogProps) {
	const quantityId = useId();

	const { data: tickets, isLoading: loadingTickets } = useTicketsByEvent(
		event.id,
	);
	const purchaseTickets = usePurchaseTickets();

	const availableTickets =
		tickets?.filter((t) => t.status === "available") || [];
	const ticketPrice = tickets?.[0]?.price || "0";

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
		setValue,
	} = useForm<PurchaseFormData>({
		resolver: zodResolver(purchaseFormSchema),
		defaultValues: {
			quantity: 1,
			card_token: "",
		},
	});

	const quantity = watch("quantity");
	const totalAmount = (Number(ticketPrice) * (quantity || 0)).toFixed(2);

	const onSubmit = async (data: PurchaseFormData) => {
		try {
			// Seleciona os primeiros N tickets disponíveis
			const selectedTickets = availableTickets
				.slice(0, data.quantity)
				.map((t) => t.id);

			if (selectedTickets.length < data.quantity) {
				toast.error("Não há tickets suficientes disponíveis");
				return;
			}

			await purchaseTickets.mutateAsync({
				ticket_ids: selectedTickets,
				card_token: data.card_token,
			});

			toast.success(
				`Compra realizada com sucesso! Total: R$ ${totalAmount}`,
			);
			reset();
			onOpenChange(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao processar compra",
			);
		}
	};

	const handleClose = () => {
		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Comprar Ingressos</DialogTitle>
					<DialogDescription>{event.name}</DialogDescription>
				</DialogHeader>

				{loadingTickets ? (
					<div className="py-8 text-center text-muted-foreground">
						Carregando ingressos...
					</div>
				) : availableTickets.length === 0 ? (
					<div className="py-8 text-center text-muted-foreground">
						Não há ingressos disponíveis para este evento.
					</div>
				) : (
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="rounded-lg bg-muted p-4 space-y-1">
							<p className="text-sm text-muted-foreground">
								Ingressos disponíveis:{" "}
								<span className="font-semibold text-foreground">
									{availableTickets.length}
								</span>
							</p>
							<p className="text-sm text-muted-foreground">
								Preço unitário:{" "}
								<span className="font-semibold text-foreground">
									R$ {Number(ticketPrice).toFixed(2)}
								</span>
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor={quantityId}>
								Quantidade <span className="text-destructive">*</span>
							</Label>
							<Input
								id={quantityId}
								type="number"
								min="1"
								max={availableTickets.length}
								placeholder="1"
								{...register("quantity")}
							/>
							{errors.quantity && (
								<p className="text-sm text-destructive">
									{errors.quantity.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label>
								Método de Pagamento <span className="text-destructive">*</span>
							</Label>
							<Select
								onValueChange={(value) => setValue("card_token", value)}
								defaultValue=""
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o cartão" />
								</SelectTrigger>
								<SelectContent>
									{PAYMENT_METHODS.map((method) => (
										<SelectItem key={method.value} value={method.value}>
											{method.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.card_token && (
								<p className="text-sm text-destructive">
									{errors.card_token.message}
								</p>
							)}
						</div>

						<div className="rounded-lg bg-primary/10 p-4">
							<p className="text-lg font-semibold">
								Total: R$ {totalAmount}
							</p>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={handleClose}
								disabled={isSubmitting}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Processando..." : "Confirmar Compra"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
