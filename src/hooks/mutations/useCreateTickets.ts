import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketService } from "../../data/di/container";
import type { CreateTicketPayload } from "../../domain/entities/Ticket";

/**
 * Hook para criar tickets de um evento
 * Usa TanStack Query para gerenciar estado da mutation
 */
export function useCreateTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: number;
      data: CreateTicketPayload;
    }) => ticketService.createTickets(eventId, data),
    onSuccess: (_data, variables) => {
      // Invalida queries relacionadas aos tickets do evento
      queryClient.invalidateQueries({
        queryKey: ["events", variables.eventId, "tickets"],
      });
      // Também invalida a lista de eventos (caso mostre contagem de tickets)
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
