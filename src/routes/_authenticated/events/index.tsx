import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Plus, Search } from "lucide-react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { EventFilters } from "@/domain/entities/Event";
import { useEventList } from "@/hooks/queries/useEventList";
import { useDebounce } from "@/hooks/useDebounce";

export const Route = createFileRoute("/_authenticated/events/")({
	component: EventsPage,
});

function EventsPage() {
	const nameFilterId = useId();
	const dateFilterId = useId();
	const locationFilterId = useId();

	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	const { control, watch, reset } = useForm<EventFilters>({
		defaultValues: {
			name: "",
			location: "",
			date: "",
		},
	});

	const nameInput = watch("name");
	const locationInput = watch("location");
	const dateFilter = watch("date");

	const debouncedName = useDebounce(nameInput);
	const debouncedLocation = useDebounce(locationInput);

	const filters: EventFilters = {
		name: debouncedName || undefined,
		location: debouncedLocation || undefined,
		date: dateFilter || undefined,
	};

	const { data: events, isLoading, error } = useEventList(filters);

	const clearFilters = () => {
		reset();
	};

	const hasActiveFilters = Object.values(filters).some((v) => v);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Eventos</h1>
					<p className="text-muted-foreground mt-1">
						Gerencie todos os seus eventos
					</p>
				</div>
				<Button onClick={() => setIsCreateDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Criar Evento
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Filtros</CardTitle>
					<CardDescription>Busque eventos específicos</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<Label htmlFor={nameFilterId}>Nome do Evento</Label>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											{...field}
											id={nameFilterId}
											placeholder="Buscar por nome..."
											className="pl-8"
										/>
									</div>
								)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={dateFilterId}>Data</Label>
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id={dateFilterId}
										type="date"
									/>
								)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={locationFilterId}>Localização</Label>
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<div className="relative">
										<MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											{...field}
											id={locationFilterId}
											placeholder="Buscar por local..."
											className="pl-8"
										/>
									</div>
								)}
							/>
						</div>
					</div>

					{hasActiveFilters && (
						<div className="mt-4">
							<Button variant="outline" size="sm" onClick={clearFilters}>
								Limpar Filtros
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Events Table */}
			<Card>
				<CardHeader>
					<CardTitle>Lista de Eventos</CardTitle>
					<CardDescription>
						{events?.length
							? `${events.length} evento(s) encontrado(s)`
							: "Nenhum evento encontrado"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					) : error ? (
						<div className="flex items-center justify-center py-8">
							<p className="text-destructive">Erro ao carregar eventos</p>
						</div>
					) : events && events.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<Calendar className="h-16 w-16 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">
								Nenhum evento encontrado
							</h3>
							<p className="text-muted-foreground mb-4">
								{hasActiveFilters
									? "Tente ajustar os filtros ou limpe-os para ver todos os eventos"
									: "Comece criando seu primeiro evento"}
							</p>
							<Button onClick={() => setIsCreateDialogOpen(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Criar Primeiro Evento
							</Button>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Descrição</TableHead>
									<TableHead>Data</TableHead>
									<TableHead>Localização</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Criado em</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{events?.map((event) => {
									const eventDate = new Date(event.date);
									const now = new Date();
									const isUpcoming = eventDate > now;

									return (
										<TableRow key={event.id}>
											<TableCell className="font-medium">{event.name}</TableCell>
											<TableCell className="max-w-xs truncate">
												{event.description}
											</TableCell>
											<TableCell>
												{eventDate.toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</TableCell>
											<TableCell>{event.location}</TableCell>
											<TableCell>
												<Badge variant={isUpcoming ? "default" : "secondary"}>
													{isUpcoming ? "Próximo" : "Realizado"}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{new Date(event.created_at).toLocaleDateString("pt-BR")}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{/* Create Event Dialog */}
			<CreateEventDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
			/>
		</div>
	);
}
