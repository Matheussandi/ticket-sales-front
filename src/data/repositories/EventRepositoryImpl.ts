import {
	type CreateEventPayload,
	type Event,
	type EventFilters,
	eventListSchema,
	eventSchema,
} from "../../domain/entities/Event";
import type { IEventRepository } from "../../domain/repositories/IEventRepository";
import type { HttpClient } from "../http/HttpClient";

/**
 * Event Repository Implementation
 *
 * Implementação concreta do repositório de eventos.
 * Realiza chamadas HTTP para a API de eventos.
 */
export class EventRepositoryImpl implements IEventRepository {
	constructor(private readonly httpClient: HttpClient) {}

	async listEvents(filters?: EventFilters): Promise<Event[]> {
		// Construir query params baseado nos filtros
		const params = new URLSearchParams();

		if (filters?.name) {
			params.append("name", filters.name);
		}
		if (filters?.date) {
			params.append("date", filters.date);
		}
		if (filters?.location) {
			params.append("location", filters.location);
		}

		const queryString = params.toString();
		const url = queryString ? `/events?${queryString}` : "/events";

		const response = await this.httpClient.get<Event[]>(url);

		// Validar a resposta com Zod
		const validatedEvents = eventListSchema.parse(response);

		return validatedEvents;
	}

	async getEventById(id: number): Promise<Event> {
		const response = await this.httpClient.get<Event>(`/events/${id}`);
		return eventSchema.parse(response);
	}

	async createEvent(data: CreateEventPayload): Promise<Event> {
		const response = await this.httpClient.post<Event>("/events", data);

		// Validar a resposta com Zod
		const validatedEvent = eventSchema.parse(response);

		return validatedEvent;
	}
}
