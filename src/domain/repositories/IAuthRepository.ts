import type { AuthResponse, LoginCredentials, RegisterData } from "../entities/User";

/**
 * Auth Repository Interface
 *
 * Define o contrato para operações de autenticação.
 * Segue o princípio de Inversão de Dependência (DIP).
 */
export interface IAuthRepository {
	login(credentials: LoginCredentials): Promise<AuthResponse>;
	register(data: RegisterData): Promise<AuthResponse>;
	logout(): Promise<void>;
	validateToken(): Promise<boolean>;
}
