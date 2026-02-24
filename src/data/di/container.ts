/**
 * Dependency Injection Container
 *
 * Centraliza a criação e configuração de dependências.
 * Implementa padrão Singleton para instâncias compartilhadas.
 */

import { AuthService } from "../../domain/services/AuthService";
import { EventService } from "../../domain/services/EventService";
import { PurchaseService } from "../../domain/services/PurchaseService";
import { TicketService } from "../../domain/services/TicketService";
import { HttpClient } from "../http/HttpClient";
import { AuthRepositoryImpl } from "../repositories/AuthRepositoryImpl";
import { EventRepositoryImpl } from "../repositories/EventRepositoryImpl";
import { PurchaseRepositoryImpl } from "../repositories/PurchaseRepositoryImpl";
import { TicketRepositoryImpl } from "../repositories/TicketRepositoryImpl";
import { TokenStorage } from "../storage/TokenStorage";

// Infrastructure Layer (Singletons)
const httpClient = new HttpClient();
const tokenStorage = new TokenStorage();

// Data Layer (Repositories)
const authRepository = new AuthRepositoryImpl(httpClient, tokenStorage);
const eventRepository = new EventRepositoryImpl(httpClient);
const ticketRepository = new TicketRepositoryImpl(httpClient);
const purchaseRepository = new PurchaseRepositoryImpl(httpClient);

// Domain Layer (Services)
export const authService = new AuthService(authRepository);
export const eventService = new EventService(eventRepository);
export const ticketService = new TicketService(ticketRepository);
export const purchaseService = new PurchaseService(purchaseRepository);

export { httpClient, tokenStorage };
