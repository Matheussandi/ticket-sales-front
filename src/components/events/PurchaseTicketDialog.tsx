import { useState } from "react";
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
import type { Event } from "@/domain/entities/Event";
import type { Ticket } from "@/domain/entities/Ticket";
import { useTicketsByEvent } from "@/hooks/queries/useTicketsByEvent";
import { formatCurrency } from "@/utils/formatters";

interface SeatSelectionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: Event;
	onConfirm: (tickets: Ticket[]) => void;
}

function SeatButton({
	ticket,
	selected,
	onToggle,
}: {
	ticket: Ticket;
	selected: boolean;
	onToggle: (id: number) => void;
}) {
	const isUnavailable = ticket.status !== "available";

	return (
		<button
			type="button"
			disabled={isUnavailable}
			onClick={() => onToggle(ticket.id)}
			title={
				isUnavailable
					? `Poltrona ${ticket.location} — ${ticket.status === "sold" ? "vendida" : "reservada"}`
					: `Poltrona ${ticket.location} — ${formatCurrency(ticket.price)}`
			}
			className={[
				"w-10 h-10 rounded text-xs font-semibold border-2 transition-colors",
				isUnavailable
					? "bg-muted text-muted-foreground border-muted cursor-not-allowed opacity-50"
					: selected
						? "bg-primary text-primary-foreground border-primary"
						: "bg-background text-foreground border-border hover:border-primary hover:bg-primary/10",
			].join(" ")}
		>
			{ticket.location}
		</button>
	);
}

export function SeatSelectionDialog({
	open,
	onOpenChange,
	event,
	onConfirm,
}: SeatSelectionDialogProps) {
	const [selectedIds, setSelectedIds] = useState<number[]>([]);

	const { data: tickets, isLoading: loadingTickets } = useTicketsByEvent(
		event.id,
	);

	const allTickets = tickets || [];
	const availableCount = allTickets.filter((t) => t.status === "available").length;

	const toggleSeat = (id: number) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
		);
	};

	const handleConfirm = () => {
		const selectedTickets = allTickets.filter((t) =>
			selectedIds.includes(t.id),
		);
		onConfirm(selectedTickets);
		setSelectedIds([]);
	};

	const handleClose = () => {
		setSelectedIds([]);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Selecionar Poltronas</DialogTitle>
					<DialogDescription>{event.name}</DialogDescription>
				</DialogHeader>

				{loadingTickets ? (
					<div className="py-8 text-center text-muted-foreground">
						Carregando poltronas...
					</div>
				) : availableCount === 0 ? (
					<div className="py-8 text-center text-muted-foreground">
						Não há ingressos disponíveis para este evento.
					</div>
				) : (
					<div className="space-y-4">
						{/* Legenda */}
						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-4 h-4 rounded border-2 border-border bg-background" />
								Disponível
							</span>
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-4 h-4 rounded border-2 border-primary bg-primary" />
								Selecionado
							</span>
							<span className="flex items-center gap-1.5">
								<span className="inline-block w-4 h-4 rounded border-2 border-muted bg-muted opacity-50" />
								Indisponível
							</span>
						</div>

						{/* Mapa de poltronas */}
						<div className="space-y-2">
							<Label>Clique nas poltronas para selecioná-las</Label>
							<div className="rounded-lg border bg-muted/20 p-4">
								<div className="mb-4 rounded bg-muted py-1 text-center text-xs text-muted-foreground">
									PALCO
								</div>
								<div className="flex flex-wrap gap-2 justify-center">
									{allTickets.map((ticket) => (
										<SeatButton
											key={ticket.id}
											ticket={ticket}
											selected={selectedIds.includes(ticket.id)}
											onToggle={toggleSeat}
										/>
									))}
								</div>
							</div>
						</div>

						{/* Resumo da seleção */}
						<div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
							<div className="flex justify-between text-muted-foreground">
								<span>Poltronas selecionadas</span>
								<span className="font-medium text-foreground">
									{selectedIds.length}
								</span>
							</div>
							{selectedIds.length > 0 && (
								<div className="flex justify-between text-muted-foreground">
									<span>Preço unitário</span>
									<span className="font-medium text-foreground">
										{formatCurrency(allTickets.find((t) => t.id === selectedIds[0])?.price ?? 0)}
									</span>
								</div>
							)}
						</div>

						<DialogFooter>
							<Button type="button" variant="outline" onClick={handleClose}>
								Cancelar
							</Button>
							<Button
								type="button"
								disabled={selectedIds.length === 0}
								onClick={handleConfirm}
							>
								Confirmar Seleção ({selectedIds.length})
							</Button>
						</DialogFooter>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
