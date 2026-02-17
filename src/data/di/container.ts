/**
 * Dependency Injection Container
 *
 * Centraliza a criação e configuração de dependências.
 * Implementa padrão Singleton para instâncias compartilhadas.
 */

import { AuthService } from "../../domain/services/AuthService";
import { EventService } from "../../domain/services/EventService";
import { HttpClient } from "../http/HttpClient";
import { AuthRepositoryImpl } from "../repositories/AuthRepositoryImpl";
import { EventRepositoryImpl } from "../repositories/EventRepositoryImpl";
import { TokenStorage } from "../storage/TokenStorage";

// Infrastructure Layer (Singletons)
const httpClient = new HttpClient();
const tokenStorage = new TokenStorage();

// Data Layer (Repositories)
const authRepository = new AuthRepositoryImpl(httpClient, tokenStorage);
const eventRepository = new EventRepositoryImpl(httpClient);

// Domain Layer (Services)
export const authService = new AuthService(authRepository);
export const eventService = new EventService(eventRepository);

export { httpClient, tokenStorage };
