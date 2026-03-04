import { useQuery } from "@tanstack/react-query";
import { eventService } from "../../data/di/container";

/**
 * Hook para buscar um evento pelo ID
 */
export function useEvent(id: number) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
}
