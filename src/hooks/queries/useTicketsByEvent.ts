import { useQuery } from "@tanstack/react-query";
import { ticketService } from "../../data/di/container";

/**
 * Hook para buscar tickets de um evento
 * Usa TanStack Query para gerenciar cache e loading
 */
export function useTicketsByEvent(eventId: number) {
  return useQuery({
    queryKey: ["events", eventId, "tickets"],
    queryFn: () => ticketService.getTicketsByEvent(eventId),
    enabled: !!eventId, // Só executa se eventId for válido
  });
}

/**
 * Hook para contar tickets disponíveis de um evento
 */
export function useAvailableTicketsCount(eventId: number) {
  return useQuery({
    queryKey: ["events", eventId, "tickets", "available-count"],
    queryFn: () => ticketService.countAvailableTickets(eventId),
    enabled: !!eventId,
  });
}
