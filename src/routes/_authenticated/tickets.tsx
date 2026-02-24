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
import type { Ticket as TicketType } from "@/domain/entities/Ticket";
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
					{Array.from({ length: 3 }, (_, i) => (
						<Skeleton key={`purchase-skeleton-${i}`} className="h-48 w-full" />
					))}
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
	const event = purchase.event;
	const tickets = purchase.tickets || [];
	const ticketCount = tickets.length;

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
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<CardTitle className="text-xl">
							{event?.name || "Evento não disponível"}
						</CardTitle>
						<CardDescription>
							Compra #{purchase.id} •{" "}
							{new Date(purchase.purchase_date).toLocaleDateString("pt-BR", {
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}
						</CardDescription>
					</div>
					<Badge variant={getStatusColor(purchase.status)}>
						{getStatusLabel(purchase.status)}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{event && (
					<div>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="flex items-start gap-3">
								<Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Data do Evento</p>
									<p className="text-sm text-muted-foreground">
										{new Date(event.date).toLocaleDateString("pt-BR", {
											day: "2-digit",
											month: "long",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div>
									<p className="text-sm font-medium">Localização</p>
									<p className="text-sm text-muted-foreground">
										{event.location}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="flex items-start gap-3">
					<Ticket className="h-5 w-5 text-muted-foreground mt-0.5" />
					<div className="flex-1">
						<p className="text-sm font-medium mb-2">
							Ingressos ({ticketCount})
						</p>
						{tickets.length > 0 ? (
							<div className="space-y-1">
								{tickets.map((ticket: TicketType) => (
									<div
										key={ticket.id}
										className="flex items-center justify-between text-sm"
									>
										<span className="text-muted-foreground">
											{ticket.location}
										</span>
										<span className="font-medium">
											R$ {Number(ticket.price).toFixed(2)}
										</span>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								Detalhes dos ingressos não disponíveis
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">Total Pago</span>
					<span className="text-xl font-bold">
						R$ {Number(purchase.total_amount).toFixed(2)}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
