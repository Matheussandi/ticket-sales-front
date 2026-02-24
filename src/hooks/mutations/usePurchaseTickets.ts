import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../../data/di/container";
import type { CreatePurchasePayload } from "../../domain/entities/Purchase";

/**
 * Hook para comprar tickets
 * Usa TanStack Query para gerenciar estado da mutation
 */
export function usePurchaseTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchasePayload) =>
      purchaseService.createPurchase(data),
    onSuccess: () => {
      // Invalida queries de eventos (atualiza disponibilidade)
      queryClient.invalidateQueries({ queryKey: ["events"] });
      // Invalida todos os tickets (status muda para sold)
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
