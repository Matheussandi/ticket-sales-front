import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { eventService } from "@/data/di/container";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { user } = useAuth();

	const {
		data: events,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["events"],
		queryFn: () => eventService.getAllEvents(),
	});

	// Últimos 5 eventos
	const recentEvents = events?.slice(0, 5) ?? [];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div>
				<h1 className="text-3xl font-bold">Bem-vindo, {user?.name}! 👋</h1>
				<p className="text-muted-foreground mt-1">
					Aqui está um resumo das suas atividades
				</p>
			</div>

			{/* Stats Cards — funcionalidade futura
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalEvents}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Eventos cadastrados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Este Mês</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.eventsThisMonth}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Eventos programados
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tickets Vendidos
						</CardTitle>
						<Ticket className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.ticketsSold}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Total de ingressos
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Receita</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							R$ {stats.revenue.toLocaleString("pt-BR")}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Valor total arrecadado
						</p>
					</CardContent>
				</Card>
			</div>
			*/}

			{/* Recent Events Table */}
			<Card>
				<CardHeader>
					<CardTitle>Eventos Recentes</CardTitle>
					<CardDescription>
						Últimos 5 eventos cadastrados no sistema
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<p className="text-muted-foreground">Carregando eventos...</p>
						</div>
					) : error ? (
						<div className="flex items-center justify-center py-8">
							<p className="text-destructive">Erro ao carregar eventos</p>
						</div>
					) : recentEvents.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Calendar className="h-12 w-12 text-muted-foreground mb-2" />
							<p className="text-muted-foreground">
								Nenhum evento cadastrado ainda
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Crie seu primeiro evento na página de Eventos
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Data</TableHead>
									<TableHead>Localização</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{recentEvents.map((event) => {
									const eventDate = new Date(event.date);

									return (
										<TableRow key={event.id}>
											<TableCell className="font-medium">{event.name}</TableCell>
											<TableCell>
												{eventDate.toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												})}
											</TableCell>
											<TableCell>{event.location}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
