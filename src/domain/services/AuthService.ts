import type { AuthResponse, LoginCredentials, RegisterData } from "../entities/User";
import type { IAuthRepository } from "../repositories/IAuthRepository";

/**
 * Auth Service
 *
 * Camada de serviço que encapsula a lógica de negócio de autenticação.
 * Coordena operações entre repositories e adiciona regras de negócio.
 */
export class AuthService {
	constructor(private readonly authRepository: IAuthRepository) {}

	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		// Aqui você pode adicionar lógica de negócio adicional
		// Por exemplo: validações extras, logs, analytics, etc.
		try {
			const response = await this.authRepository.login(credentials);
			return response;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao fazer login",
			);
		}
	}

	async register(data: RegisterData): Promise<AuthResponse> {
		try {
			const response = await this.authRepository.register(data);
			return response;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao registrar usuário",
			);
		}
	}

	async logout(): Promise<void> {
		try {
			await this.authRepository.logout();
		} catch (error) {
			console.error("Erro ao fazer logout:", error);
		}
	}

	async validateToken(): Promise<boolean> {
		try {
			return await this.authRepository.validateToken();
		} catch {
			return false;
		}
	}
}
