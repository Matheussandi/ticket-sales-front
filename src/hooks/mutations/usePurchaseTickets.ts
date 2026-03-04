import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseService } from "../../data/di/container";
import type { CreatePurchasePayload } from "../../domain/entities/Purchase";

export function usePurchaseTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePurchasePayload) =>
      purchaseService.createPurchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["my-purchases"] });
    },
  });
}
