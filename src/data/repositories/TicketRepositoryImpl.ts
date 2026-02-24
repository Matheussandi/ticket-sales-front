import type {
  CreateTicketPayload,
  Ticket,
} from "../../domain/entities/Ticket";
import { ticketListSchema } from "../../domain/entities/Ticket";
import type { ITicketRepository } from "../../domain/repositories/ITicketRepository";
import type { HttpClient } from "../http/HttpClient";

/**
 * Implementação do repositório de tickets
 * Faz chamadas HTTP para a API
 */
export class TicketRepositoryImpl implements ITicketRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async createTickets(
    eventId: number,
    data: CreateTicketPayload,
  ): Promise<void> {
    await this.httpClient.post(`/events/${eventId}/tickets`, data);
    // API retorna 204 No Content, não há resposta para validar
  }

  async getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    const response = await this.httpClient.get<Ticket[]>(
      `/events/${eventId}/tickets`,
    );

    // Validação com Zod
    const validatedTickets = ticketListSchema.parse(response);
    return validatedTickets;
  }
}
