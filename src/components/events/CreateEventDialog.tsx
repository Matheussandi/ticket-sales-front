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
import {
	type CreateEventFormData,
	createEventSchema,
} from "@/domain/entities/Event";
import { useCreateEvent } from "@/hooks/mutations/useCreateEvent";

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

	const createEvent = useCreateEvent();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateEventFormData>({
		resolver: zodResolver(createEventSchema),
	});

	const onSubmit = async (data: CreateEventFormData) => {
		try {
			await createEvent.mutateAsync(data);
			toast.success("Evento criado com sucesso!");
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
						Preencha os dados do evento. Clique em salvar quando terminar.
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
