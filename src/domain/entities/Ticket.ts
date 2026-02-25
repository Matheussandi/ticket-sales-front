import { z } from "zod";

/**
 * Schema para ticket retornado pela API
 */
export const ticketSchema = z.object({
  id: z.number(),
  location: z.string(),
  event_id: z.number(),
  price: z.string(), // API retorna como string (decimal)
  status: z.enum(["available", "sold", "reserved"]),
  created_at: z.coerce.date(),
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
export type CreateTicketPayload = z.infer<typeof createTicketSchema>;
