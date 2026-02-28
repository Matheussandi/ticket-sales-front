import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Receipt, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { PurchaseWithDetails } from "@/domain/entities/Purchase";
import type { TicketWithEvent } from "@/domain/entities/Ticket";
import { useMyPurchases } from "@/hooks/queries/useMyPurchases";

export const Route = createFileRoute("/_authenticated/tickets")({
	component: MyTicketsPage,
});

function MyTicketsPage() {
	const { data: purchases, isLoading, error } = useMyPurchases();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Meus Ingressos</h1>
				<p className="text-muted-foreground mt-1">
					Visualize suas compras realizadas
				</p>
			</div>

			{isLoading ? (
				<div className="space-y-4">
					<Skeleton className="h-125 w-full" />
					<Skeleton className="h-125 w-full" />
					<Skeleton className="h-125 w-full" />
				</div>
			) : error ? (
				<Card>
					<CardContent className="flex items-center justify-center py-12">
						<p className="text-destructive">Erro ao carregar compras</p>
					</CardContent>
				</Card>
			) : !purchases || purchases.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<Receipt className="h-16 w-16 text-muted-foreground mb-4" />
						<h3 className="text-lg font-semibold mb-2">
							Nenhuma compra realizada
						</h3>
						<p className="text-muted-foreground">
							Você ainda não comprou nenhum ingresso. Explore os eventos
							disponíveis!
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{purchases.map((purchase) => (
						<PurchaseCard key={purchase.id} purchase={purchase} />
					))}
				</div>
			)}
		</div>
	);
}

interface PurchaseCardProps {
	purchase: PurchaseWithDetails;
}

function PurchaseCard({ purchase }: PurchaseCardProps) {
	const tickets = purchase.tickets || [];
	const ticketCount = tickets.length;
	// O evento vem dentro do primeiro ticket
	const event = tickets.length > 0 ? tickets[0].event : null;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "default";
			case "pending":
				return "outline";
			case "cancelled":
				return "destructive";
			default:
				return "secondary";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "paid":
				return "Pago";
			case "pending":
				return "Pendente";
			case "cancelled":
				return "Cancelado";
			default:
				return status;
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-1">
						<div className="flex items-center gap-2">
							<CardTitle className="text-2xl">
								{event?.name || "Evento não disponível"}
							</CardTitle>
						</div>
						<CardDescription className="text-base">
							{event?.description || "Sem descrição"}
						</CardDescription>
					</div>
					<Badge variant={getStatusColor(purchase.status)} className="shrink-0">
						{getStatusLabel(purchase.status)}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Informações do Evento */}
				{event && (
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex items-start gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<Calendar className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">
									Data do Evento
								</p>
								<p className="text-sm font-semibold">
									{new Date(event.date).toLocaleDateString("pt-BR", {
										day: "2-digit",
										month: "long",
										year: "numeric",
									})}
								</p>
								<p className="text-sm text-muted-foreground">
									{new Date(event.date).toLocaleTimeString("pt-BR", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
								<MapPin className="h-5 w-5 text-primary" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">
									Localização
								</p>
								<p className="text-sm font-semibold">{event.location}</p>
							</div>
						</div>
					</div>
				)}

				<Separator />

				{/* Ingressos */}
				<div>
					<div className="mb-3 flex items-center gap-2">
						<Ticket className="h-5 w-5 text-primary" />
						<h3 className="text-sm font-semibold">
							Ingressos Adquiridos ({ticketCount})
						</h3>
					</div>

					{tickets.length > 0 ? (
						<div className="space-y-2">
							{tickets.map((ticket: TicketWithEvent) => (
								<div
									key={ticket.id}
									className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3"
								>
									<div className="flex items-center gap-3">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
											<Ticket className="h-4 w-4 text-primary" />
										</div>
										<div>
											<p className="text-sm font-medium">{ticket.location}</p>
											<p className="text-xs text-muted-foreground">
												Ingresso #{ticket.id}
											</p>
										</div>
									</div>
									<p className="text-sm font-semibold">
										R$ {Number(ticket.price).toFixed(2)}
									</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							Detalhes dos ingressos não disponíveis
						</p>
					)}
				</div>

				<Separator />

				{/* Total e Info da Compra */}
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Compra</span>
						<span className="font-medium">#{purchase.id}</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Data da Compra</span>
						<span className="font-medium">
							{new Date(purchase.purchase_date).toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "short",
								year: "numeric",
							})}
						</span>
					</div>
					<Separator />
					<div className="flex items-center justify-between rounded-lg bg-primary/5 px-4 py-3">
						<span className="text-base font-semibold">Total Pago</span>
						<span className="text-2xl font-bold text-primary">
							R$ {Number(purchase.total_amount).toFixed(2)}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
