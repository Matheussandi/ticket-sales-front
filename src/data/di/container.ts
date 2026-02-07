/**
 * Dependency Injection Container
 *
 * Centraliza a criação e configuração de dependências.
 * Implementa padrão Singleton para instâncias compartilhadas.
 */

import { AuthService } from "../../domain/services/AuthService";
import { HttpClient } from "../http/HttpClient";
import { AuthRepositoryImpl } from "../repositories/AuthRepositoryImpl";
import { TokenStorage } from "../storage/TokenStorage";

// Infrastructure Layer (Singletons)
const httpClient = new HttpClient();
const tokenStorage = new TokenStorage();

// Data Layer (Repositories)
const authRepository = new AuthRepositoryImpl(httpClient, tokenStorage);

// Domain Layer (Services)
export const authService = new AuthService(authRepository);

export { httpClient, tokenStorage };
