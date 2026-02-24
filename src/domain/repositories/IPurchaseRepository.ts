import type { CreatePurchasePayload, Purchase, PurchaseWithDetails } from "../entities/Purchase";

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

  /**
   * Lista todas as compras do usuário logado
   * @returns Lista de compras com detalhes
   */
  getMyPurchases(): Promise<PurchaseWithDetails[]>;
}
