import type { CreatePurchasePayload, Purchase } from "../entities/Purchase";
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
}
