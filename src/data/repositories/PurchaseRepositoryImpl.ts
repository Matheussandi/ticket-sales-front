import type {
  CreatePurchasePayload,
  Purchase,
  PurchaseWithDetails,
} from "../../domain/entities/Purchase";
import { purchaseListSchema, purchaseSchema } from "../../domain/entities/Purchase";
import type { IPurchaseRepository } from "../../domain/repositories/IPurchaseRepository";
import type { HttpClient } from "../http/HttpClient";

/**
 * Implementação do repositório de compras
 * Faz chamadas HTTP para a API
 */
export class PurchaseRepositoryImpl implements IPurchaseRepository {
  constructor(private readonly httpClient: HttpClient) {}

  async createPurchase(data: CreatePurchasePayload): Promise<Purchase> {
    const response = await this.httpClient.post<Purchase>("/purchases", data);

    // Validação com Zod
    const validatedPurchase = purchaseSchema.parse(response);
    return validatedPurchase;
  }

  async getMyPurchases(): Promise<PurchaseWithDetails[]> {
    const response = await this.httpClient.get<PurchaseWithDetails[]>("/purchases");

    // Validação com Zod
    const validatedPurchases = purchaseListSchema.parse(response);
    return validatedPurchases;
  }
}
