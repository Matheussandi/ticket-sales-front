import type {
	CreateEventPayload,
	Event,
	EventFilters,
} from "../entities/Event";

/**
 * Event Repository Interface
 *
 * Define o contrato para operações de eventos.
 * Segue o princípio de Inversão de Dependência (DIP).
 */
export interface IEventRepository {
	listEvents(filters?: EventFilters): Promise<Event[]>;
	getEventById(id: number): Promise<Event>;
	createEvent(data: CreateEventPayload): Promise<Event>;
}
