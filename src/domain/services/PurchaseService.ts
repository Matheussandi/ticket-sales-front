import type { CreatePurchasePayload, Purchase, PurchaseWithDetails } from "../entities/Purchase";
import type { IPurchaseRepository } from "../repositories/IPurchaseRepository";

/**
 * Service de compras - encapsula regras de negócio
 */
export class PurchaseService {
  constructor(private readonly purchaseRepository: IPurchaseRepository) {}

  /**
   * Cria uma nova compra de tickets
   * @param data Dados da compra
   * @returns Dados da compra criada
   */
  async createPurchase(data: CreatePurchasePayload): Promise<Purchase> {
    // Validações de negócio
    if (!data.ticket_ids || data.ticket_ids.length === 0) {
      throw new Error("Selecione pelo menos um ticket");
    }

    if (!data.card_token || data.card_token.trim() === "") {
      throw new Error("Selecione um método de pagamento");
    }

    try {
      const purchase = await this.purchaseRepository.createPurchase(data);
      return purchase;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erro ao processar compra",
      );
    }
  }

  /**
   * Lista todas as compras do usuário logado
   * @returns Lista de compras com detalhes, ordenadas por data (mais recente primeiro)
   */
  async getMyPurchases(): Promise<PurchaseWithDetails[]> {
    try {
      const purchases = await this.purchaseRepository.getMyPurchases();
      // Ordenar por data de compra (mais recente primeiro)
      return purchases.sort((a, b) => 
        new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Erro ao buscar compras",
      );
    }
  }
}
