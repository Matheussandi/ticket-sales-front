import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/data/di/container";
import type { CreateEventPayload } from "@/domain/entities/Event";

export function useCreateEvent() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateEventPayload) => eventService.createEvent(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
}
