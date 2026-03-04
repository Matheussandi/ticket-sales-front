import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Calendar,
	CreditCard,
	MapPin,
	ShoppingCart,
	Ticket,
	X,
} from "lucide-react";
import { useState } from "react";
import { PaymentDialog } from "@/components/events/PaymentDialog";
import { SeatSelectionDialog } from "@/components/events/PurchaseTicketDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import type { Ticket as TicketEntity } from "@/domain/entities/Ticket";
import { useEvent } from "@/hooks/queries/useEvent";
import { useAvailableTicketsCount } from "@/hooks/queries/useTicketsByEvent";
import { formatCurrency } from "@/utils/formatters";

export const Route = createFileRoute("/_authenticated/events/$eventId")({
	component: EventDetailPage,
});

function EventDetailPage() {
	const { eventId } = Route.useParams();
	const { user } = useAuth();
	const isCustomer = user?.role === "customer";

	const [isSeatOpen, setIsSeatOpen] = useState(false);
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [selectedTickets, setSelectedTickets] = useState<TicketEntity[]>([]);

	const handleSeatConfirm = (tickets: TicketEntity[]) => {
		setSelectedTickets(tickets);
		setIsSeatOpen(false);
	};

	const handlePaymentSuccess = () => {
		setIsPaymentOpen(false);
		setSelectedTickets([]);
	};

	const handleClearSelection = () => {
		setSelectedTickets([]);
	};

	const { data: event, isLoading, error } = useEvent(Number(eventId));
	const { data: availableCount, isLoading: loadingTickets } =
		useAvailableTicketsCount(Number(eventId));

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	if (error || !event) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
				<p className="text-destructive text-lg">Evento não encontrado.</p>
				<Button variant="outline" asChild>
					<Link to="/events/">← Voltar para Eventos</Link>
				</Button>
			</div>
		);
	}

	const eventDate = new Date(event.date);
	const now = new Date();
	const isUpcoming = eventDate > now;
	const canBuy = isCustomer && isUpcoming && (availableCount ?? 0) > 0;

	return (
		<div className="space-y-6">
			{/* Breadcrumb / volta */}
			<div>
				<Button variant="ghost" size="sm" asChild>
					<Link to="/events/">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Voltar para Eventos
					</Link>
				</Button>
			</div>

			{/* Header do evento */}
			<div className="flex items-start justify-between gap-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold">{event.name}</h1>
					<Badge variant={isUpcoming ? "default" : "secondary"}>
						{isUpcoming ? "Próximo" : "Realizado"}
					</Badge>
				</div>

				{isCustomer && (
					<div className="flex items-center gap-2">
						{selectedTickets.length > 0 && (
							<Button
								size="lg"
								variant="outline"
								onClick={() => setIsSeatOpen(true)}
							>
								<ShoppingCart className="mr-2 h-5 w-5" />
								Editar Poltronas
							</Button>
						)}
						<Button
							size="lg"
							disabled={!canBuy}
							onClick={() => setIsSeatOpen(true)}
						>
							<ShoppingCart className="mr-2 h-5 w-5" />
							{!isUpcoming
								? "Evento encerrado"
								: (availableCount ?? 0) === 0 && !loadingTickets
									? "Esgotado"
									: selectedTickets.length > 0
										? "Alterar Seleção"
										: "Selecionar Poltronas"}
						</Button>
					</div>
				)}
			</div>

			{/* Detalhes */}
			<div className="grid gap-6 md:grid-cols-3">
				{/* Informações principais */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Sobre o Evento</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground leading-relaxed">
							{event.description}
						</p>

						<div className="grid gap-3 pt-2">
							<div className="flex items-center gap-3 text-sm">
								<Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
								<span>
									{eventDate.toLocaleDateString("pt-BR", {
										weekday: "long",
										day: "2-digit",
										month: "long",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
							<div className="flex items-center gap-3 text-sm">
								<MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
								<span>{event.location}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Card de ingressos */}
				<Card>
					<CardHeader>
						<CardTitle>Ingressos</CardTitle>
						<CardDescription>Disponibilidade e preços</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{loadingTickets ? (
							<Skeleton className="h-16 w-full" />
						) : (
							<>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Ticket className="h-4 w-4" />
										<span>Disponíveis</span>
									</div>
									<Badge
										variant={
											(availableCount ?? 0) > 0 ? "default" : "destructive"
										}
									>
										{availableCount ?? 0}
									</Badge>
								</div>

								{isCustomer && isUpcoming && (availableCount ?? 0) > 0 && (
									<Button
										className="w-full"
										onClick={() => setIsSeatOpen(true)}
									>
										Selecionar Poltronas
									</Button>
								)}

								{!isUpcoming && (
									<p className="text-xs text-muted-foreground text-center">
										As vendas para este evento foram encerradas.
									</p>
								)}

								{isUpcoming && (availableCount ?? 0) === 0 && !loadingTickets && (
									<p className="text-xs text-destructive text-center">
										Ingressos esgotados.
									</p>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Poltronas selecionadas */}
			{isCustomer && selectedTickets.length > 0 && (
				<div className="rounded-lg border bg-card p-5 space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-base">Poltronas Selecionadas</h2>
						<button
							type="button"
							onClick={handleClearSelection}
							className="text-muted-foreground hover:text-foreground transition-colors"
							title="Limpar seleção"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{selectedTickets.map((ticket) => (
							<Badge key={ticket.id} variant="secondary" className="text-sm px-3 py-1">
								{ticket.location}
							</Badge>
						))}
					</div>
					<div className="flex items-center justify-between pt-1">
						<span className="text-sm text-muted-foreground">
							{selectedTickets.length} poltrona{selectedTickets.length !== 1 ? "s" : ""} ·{" "}
							{formatCurrency((selectedTickets[0]?.price ?? 0) * selectedTickets.length)}
						</span>
						<Button onClick={() => setIsPaymentOpen(true)}>
							<CreditCard className="mr-2 h-4 w-4" />
							Realizar Pagamento
						</Button>
					</div>
				</div>
			)}

			{/* Modal de seleção de poltronas */}
			{isCustomer && event && (
				<SeatSelectionDialog
					open={isSeatOpen}
					onOpenChange={setIsSeatOpen}
					event={event}
					onConfirm={handleSeatConfirm}
				/>
			)}

			{/* Modal de pagamento */}
			{isCustomer && event && selectedTickets.length > 0 && (
				<PaymentDialog
					open={isPaymentOpen}
					onOpenChange={setIsPaymentOpen}
					event={event}
					selectedTickets={selectedTickets}
					onSuccess={handlePaymentSuccess}
				/>
			)}
		</div>
	);
}