import { useQuery } from "@tanstack/react-query";
import { purchaseService } from "../../data/di/container";

/**
 * Hook para buscar as compras do usuário logado
 * Usa TanStack Query para gerenciar cache e loading
 */
export function useMyPurchases() {
  return useQuery({
    queryKey: ["my-purchases"],
    queryFn: () => purchaseService.getMyPurchases(),
  });
}
