import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/data/di/container";
import type { EventFilters } from "@/domain/entities/Event";

export function useEventList(filters?: EventFilters) {
	return useQuery({
		queryKey: ["events", filters],
		queryFn: () =>
			filters ? eventService.searchEvents(filters) : eventService.getAllEvents(),
	});
}
