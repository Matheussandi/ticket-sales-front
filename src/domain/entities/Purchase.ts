import { z } from "zod";
import { ticketWithEventSchema } from "./Ticket";

export const purchaseSchema = z.object({
  id: z.number(),
  customer_id: z.number().optional(), // Não retornado pelo endpoint de listagem
  purchase_date: z.coerce.date(),
  total_amount: z.coerce.number(), // API pode retornar como string ou number
  status: z.enum(["paid", "pending", "cancelled"]),
});

export const purchaseWithDetailsSchema = purchaseSchema.extend({
  tickets: z.array(ticketWithEventSchema).optional(),
});

/**
 * Schema para lista de compras
 */
export const purchaseListSchema = z.array(purchaseWithDetailsSchema);

export const createPurchaseSchema = z.object({
  ticket_ids: z
    .array(z.number())
    .min(1, "Selecione pelo menos um ticket"),
  card_token: z.string().min(1, "Selecione um método de pagamento"),
});

export type Purchase = z.infer<typeof purchaseSchema>;
export type PurchaseWithDetails = z.infer<typeof purchaseWithDetailsSchema>;
export type CreatePurchasePayload = z.infer<typeof createPurchaseSchema>;
