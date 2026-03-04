import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PAYMENT_METHODS } from "@/constants/paymentMethods";
import type { Event } from "@/domain/entities/Event";
import type { Ticket } from "@/domain/entities/Ticket";
import { usePurchaseTickets } from "@/hooks/mutations/usePurchaseTickets";
import { formatCurrency } from "@/utils/formatters";

const paymentFormSchema = z.object({
	card_token: z.string().min(1, "Selecione um método de pagamento"),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

interface PaymentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: Event;
	selectedTickets: Ticket[];
	onSuccess: () => void;
}

export function PaymentDialog({
	open,
	onOpenChange,
	event,
	selectedTickets,
	onSuccess,
}: PaymentDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const purchaseTickets = usePurchaseTickets();

	const unitPrice = selectedTickets[0]?.price ?? 0;
	const totalAmount = unitPrice * selectedTickets.length;

	const {
		setValue,
		watch,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PaymentFormData>({
		// @ts-expect-error zod v4 x resolver v3 version mismatch
		resolver: zodResolver(paymentFormSchema),
		defaultValues: { card_token: "" },
	});

	const cardToken = watch("card_token");

	const handleClose = () => {
		reset();
		onOpenChange(false);
	};

	const onSubmit = async (data: PaymentFormData) => {
		setIsSubmitting(true);
		try {
			await purchaseTickets.mutateAsync({
				ticket_ids: selectedTickets.map((t) => t.id),
				card_token: data.card_token,
			});

			toast.success(
				`Compra realizada com sucesso! Total: ${formatCurrency(totalAmount)}`,
			);
			reset();
			onSuccess();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao processar compra",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[440px]">
				<DialogHeader>
					<DialogTitle>Realizar Pagamento</DialogTitle>
					<DialogDescription>{event.name}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					{/* Poltronas selecionadas */}
					<div className="space-y-2">
						<Label>Poltronas selecionadas</Label>
						<div className="flex flex-wrap gap-2">
							{selectedTickets.map((ticket) => (
								<Badge key={ticket.id} variant="secondary" className="text-sm px-3 py-1">
									{ticket.location}
								</Badge>
							))}
						</div>
					</div>

					<Separator />

					{/* Resumo de valores */}
					<div className="space-y-2 text-sm">
						<div className="flex justify-between text-muted-foreground">
							<span>Quantidade</span>
							<span className="font-medium text-foreground">
								{selectedTickets.length} poltrona{selectedTickets.length !== 1 ? "s" : ""}
							</span>
						</div>
						<div className="flex justify-between text-muted-foreground">
							<span>Preço unitário</span>
							<span className="font-medium text-foreground">
								{formatCurrency(unitPrice)}
							</span>
						</div>
					</div>

					<Separator />

					{/* Método de pagamento */}
					<div className="space-y-2">
						<Label>
							Método de Pagamento <span className="text-destructive">*</span>
						</Label>
						<Select
							value={cardToken}
							onValueChange={(v) =>
								setValue("card_token", v, { shouldValidate: true })
							}
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

					{/* Total */}
					<div className="rounded-lg bg-primary/10 p-4 flex justify-between items-center">
						<span className="font-semibold">Total</span>
						<span className="text-lg font-bold">{formatCurrency(totalAmount)}</span>
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
							{isSubmitting ? "Processando..." : "Confirmar Pagamento"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
