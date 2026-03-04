import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";
import {
	type CreateEventWithTicketsFormData,
	createEventWithTicketsSchema,
} from "@/domain/entities/Event";
import { useCreateEvent } from "@/hooks/mutations/useCreateEvent";
import { useCreateTickets } from "@/hooks/mutations/useCreateTickets";

interface CreateEventDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({
	open,
	onOpenChange,
}: CreateEventDialogProps) {
	const nameId = useId();
	const descriptionId = useId();
	const dateId = useId();
	const locationId = useId();
	const numTicketsId = useId();
	const priceId = useId();

	const createEvent = useCreateEvent();
	const createTickets = useCreateTickets();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateEventWithTicketsFormData>({
		resolver: zodResolver(createEventWithTicketsSchema),
	});

	const onSubmit = async (data: CreateEventWithTicketsFormData) => {
		try {
			// Primeiro cria o evento
			const { name, description, date, location, num_tickets, price } = data;
			const event = await createEvent.mutateAsync({
				name,
				description,
				date,
				location,
			});

			// Se houver dados de tickets, cria os tickets
			const numTicketsNum = num_tickets ? Number(num_tickets) : undefined;
			const priceNum = price ? Number(price) : undefined;

			if (
				numTicketsNum &&
				priceNum &&
				numTicketsNum > 0 &&
				priceNum > 0
			) {
				await createTickets.mutateAsync({
					eventId: event.id,
					data: {
						num_tickets: numTicketsNum,
						price: priceNum,
					},
				});
				toast.success("Evento e tickets criados com sucesso!");
			} else {
				toast.success("Evento criado com sucesso!");
			}

			reset();
			onOpenChange(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao criar evento",
			);
		}
	};

	const handleClose = () => {
		reset();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Criar Novo Evento</DialogTitle>
					<DialogDescription>
						Preencha os dados do evento
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor={nameId}>
							Nome do Evento <span className="text-destructive">*</span>
						</Label>
						<Input
							id={nameId}
							placeholder="Ex: Festival de Música 2026"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-destructive">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={descriptionId}>
							Descrição <span className="text-destructive">*</span>
						</Label>
						<textarea
							id={descriptionId}
							placeholder="Descreva os detalhes do evento..."
							className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							{...register("description")}
						/>
						{errors.description && (
							<p className="text-sm text-destructive">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={dateId}>
							Data e Hora <span className="text-destructive">*</span>
						</Label>
						<Input
							id={dateId}
							type="datetime-local"
							{...register("date")}
						/>
						{errors.date && (
							<p className="text-sm text-destructive">{errors.date.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor={locationId}>
							Localização <span className="text-destructive">*</span>
						</Label>
						<Input
							id={locationId}
							placeholder="Ex: São Paulo - SP"
							{...register("location")}
						/>
						{errors.location && (
							<p className="text-sm text-destructive">
								{errors.location.message}
							</p>
						)}
					</div>

					<Separator />

					<div className="space-y-4">
						<div>
							<h4 className="text-sm font-medium">Ingressos (Opcional)</h4>
							<p className="text-sm text-muted-foreground">
								Defina quantidade e preço dos ingressos
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={numTicketsId}>Quantidade</Label>
								<Input
									id={numTicketsId}
									type="number"
									placeholder="Ex: 100"
									min="1"
									{...register("num_tickets")}
								/>
								{errors.num_tickets && (
									<p className="text-sm text-destructive">
										{errors.num_tickets.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor={priceId}>Preço (R$)</Label>
								<Input
									id={priceId}
									type="number"
									placeholder="Ex: 50.00"
									min="0.01"
									step="0.01"
									{...register("price")}
								/>
								{errors.price && (
									<p className="text-sm text-destructive">
										{errors.price.message}
									</p>
								)}
							</div>
						</div>
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
							{isSubmitting ? "Salvando..." : "Salvar Evento"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
