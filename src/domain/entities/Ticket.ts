import { z } from "zod";

/**
 * Schema para ticket retornado pela API
 */
export const ticketSchema = z.object({
  id: z.number(),
  location: z.string(),
  event_id: z.number(),
  price: z.coerce.number(), // API pode retornar como string ou number
  status: z.enum(["available", "sold", "reserved"]),
  created_at: z.coerce.date(),
});

/**
 * Schema básico de evento (usado em purchases - sem created_at e partner_id)
 */
const eventBasicSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  location: z.string(),
});

/**
 * Schema para ticket com evento aninhado (usado em purchases)
 */
export const ticketWithEventSchema = z.object({
  id: z.number(),
  location: z.string(),
  price: z.coerce.number(),
  status: z.enum(["available", "sold", "reserved"]),
  event: eventBasicSchema,
});

/**
 * Schema para criação de múltiplos tickets
 */
export const createTicketSchema = z.object({
  num_tickets: z.number().int().positive("Número de tickets deve ser positivo"),
  price: z.number().positive("Preço deve ser positivo"),
});

/**
 * Schema para lista de tickets
 */
export const ticketListSchema = z.array(ticketSchema);

/**
 * Tipos derivados dos schemas
 */
export type Ticket = z.infer<typeof ticketSchema>;
export type TicketWithEvent = z.infer<typeof ticketWithEventSchema>;
export type CreateTicketPayload = z.infer<typeof createTicketSchema>;
