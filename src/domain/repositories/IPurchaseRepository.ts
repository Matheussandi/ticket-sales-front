import type { CreatePurchasePayload, Purchase } from "../entities/Purchase";

/**
 * Interface do repositório de compras
 * Define operações de persistência para compras de tickets
 */
export interface IPurchaseRepository {
  /**
   * Cria uma nova compra de tickets
   * @param data Dados da compra (ticket_ids e card_token)
   * @returns Dados da compra criada
   */
  createPurchase(data: CreatePurchasePayload): Promise<Purchase>;
}
