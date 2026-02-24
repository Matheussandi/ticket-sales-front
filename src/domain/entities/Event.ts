import { z } from "zod";

// Schema base do evento como retornado pela API
export const eventSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	date: z.coerce.date(),
	location: z.string(),
	created_at: z.coerce.date(),
	partner_id: z.number(),
});

// Schema para criar evento (payload)
export const createEventSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.min(3, "Nome deve ter no mínimo 3 caracteres"),
	description: z
		.string()
		.min(1, "Descrição é obrigatória")
		.min(10, "Descrição deve ter no mínimo 10 caracteres"),
	date: z.string().min(1, "Data é obrigatória"),
	location: z
		.string()
		.min(1, "Localização é obrigatória")
		.min(3, "Localização deve ter no mínimo 3 caracteres"),
});

// Schema para formulário de criação de evento com tickets opcionais
export const createEventWithTicketsSchema = createEventSchema.extend({
	num_tickets: z
		.string()
		.optional()
		.transform((val) => {
			if (!val || val === "") return undefined;
			const num = Number(val);
			return Number.isNaN(num) ? undefined : num;
		}),
	price: z
		.string()
		.optional()
		.transform((val) => {
			if (!val || val === "") return undefined;
			const num = Number(val);
			return Number.isNaN(num) ? undefined : num;
		}),
});

// Schema para resposta da lista de eventos
export const eventListSchema = z.array(eventSchema);

// Schema para filtros de eventos
export const eventFiltersSchema = z.object({
	name: z.string().optional(),
	date: z.string().optional(),
	location: z.string().optional(),
});

// Types derivados dos schemas
export type Event = z.infer<typeof eventSchema>;
export type CreateEventPayload = z.infer<typeof createEventSchema>;
export type CreateEventFormData = CreateEventPayload;
export type CreateEventWithTicketsFormData = z.infer<
	typeof createEventWithTicketsSchema
>;
export type EventFilters = z.infer<typeof eventFiltersSchema>;
