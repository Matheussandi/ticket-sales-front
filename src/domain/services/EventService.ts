import type {
	CreateEventPayload,
	Event,
	EventFilters,
} from "../entities/Event";
import type { IEventRepository } from "../repositories/IEventRepository";

/**
 * Event Service
 *
 * Camada de serviço que encapsula a lógica de negócio de eventos.
 * Coordena operações entre repositories e adiciona regras de negócio.
 */
export class EventService {
	constructor(private readonly eventRepository: IEventRepository) {}

	async getAllEvents(): Promise<Event[]> {
		try {
			const events = await this.eventRepository.listEvents();
			// Ordenar por data de criação (mais recente primeiro)
			return events.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao buscar eventos",
			);
		}
	}

	async searchEvents(filters: EventFilters): Promise<Event[]> {
		try {
			const events = await this.eventRepository.listEvents(filters);
			// Ordenar por data do evento (mais próximo primeiro)
			return events.sort(
				(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
			);
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao buscar eventos",
			);
		}
	}

	async getEventById(id: number): Promise<Event> {
		try {
			return await this.eventRepository.getEventById(id);
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao buscar evento",
			);
		}
	}

	async createEvent(data: CreateEventPayload): Promise<Event> {
		try {
			// Validação adicional: data não pode ser no passado
			const eventDate = new Date(data.date);
			const now = new Date();
			if (eventDate <= now) {
				throw new Error("A data do evento deve ser no futuro");
			}

			const event = await this.eventRepository.createEvent(data);
			return event;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao criar evento",
			);
		}
	}
}
