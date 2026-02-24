import type { CreateTicketPayload, Ticket } from "../entities/Ticket";

/**
 * Interface do repositório de tickets
 * Define operações de persistência para tickets
 */
export interface ITicketRepository {
  /**
   * Cria múltiplos tickets para um evento
   * @param eventId ID do evento
   * @param data Dados para criação dos tickets
   */
  createTickets(eventId: number, data: CreateTicketPayload): Promise<void>;

  /**
   * Lista todos os tickets de um evento
   * @param eventId ID do evento
   * @returns Lista de tickets
   */
  getTicketsByEvent(eventId: number): Promise<Ticket[]>;
}
