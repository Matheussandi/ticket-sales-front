import type { CreateTicketPayload, Ticket } from "../entities/Ticket";
import type { ITicketRepository } from "../repositories/ITicketRepository";

/**
 * Service de tickets - encapsula regras de negócio
 */
export class TicketService {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  /**
   * Cria múltiplos tickets para um evento
   * @param eventId ID do evento
   * @param data Dados para criação dos tickets
   */
  async createTickets(
    eventId: number,
    data: CreateTicketPayload,
  ): Promise<void> {
    // Validações de negócio
    if (data.num_tickets <= 0) {
      throw new Error("O número de tickets deve ser maior que zero");
    }

    if (data.price <= 0) {
      throw new Error("O preço deve ser maior que zero");
    }

    try {
      await this.ticketRepository.createTickets(eventId, data);
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erro ao criar tickets",
      );
    }
  }

  /**
   * Lista todos os tickets de um evento
   * @param eventId ID do evento
   * @returns Lista de tickets ordenados por location
   */
  async getTicketsByEvent(eventId: number): Promise<Ticket[]> {
    try {
      const tickets = await this.ticketRepository.getTicketsByEvent(eventId);
      
      // Ordenar por localização (Location 1, Location 2, etc.)
      return tickets.sort((a, b) => {
        const numA = Number.parseInt(a.location.match(/\d+/)?.[0] || "0");
        const numB = Number.parseInt(b.location.match(/\d+/)?.[0] || "0");
        return numA - numB;
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erro ao buscar tickets",
      );
    }
  }

  /**
   * Conta tickets disponíveis de um evento
   * @param eventId ID do evento
   * @returns Número de tickets disponíveis
   */
  async countAvailableTickets(eventId: number): Promise<number> {
    const tickets = await this.getTicketsByEvent(eventId);
    return tickets.filter((ticket) => ticket.status === "available").length;
  }
}
