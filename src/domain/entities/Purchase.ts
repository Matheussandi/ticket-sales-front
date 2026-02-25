import { z } from "zod";
import { eventSchema } from "./Event";
import { ticketSchema } from "./Ticket";

/**
 * Schema para compra retornada pela API
 */
export const purchaseSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  purchase_date: z.coerce.date(),
  total_amount: z.string(), // API retorna como string (decimal)
  status: z.enum(["paid", "pending", "cancelled"]),
});

/**
 * Schema para compra com detalhes (evento e tickets)
 */
export const purchaseWithDetailsSchema = purchaseSchema.extend({
  event: eventSchema.optional(),
  tickets: z.array(ticketSchema).optional(),
});

/**
 * Schema para lista de compras
 */
export const purchaseListSchema = z.array(purchaseWithDetailsSchema);

/**
 * Schema para criação de compra
 */
export const createPurchaseSchema = z.object({
  ticket_ids: z
    .array(z.number())
    .min(1, "Selecione pelo menos um ticket"),
  card_token: z.string().min(1, "Selecione um método de pagamento"),
});

/**
 * Tipos derivados dos schemas
 */
export type Purchase = z.infer<typeof purchaseSchema>;
export type PurchaseWithDetails = z.infer<typeof purchaseWithDetailsSchema>;
export type CreatePurchasePayload = z.infer<typeof createPurchaseSchema>;
