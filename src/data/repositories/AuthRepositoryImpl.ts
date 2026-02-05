import type {
	AuthResponse,
	LoginCredentials,
	RegisterData,
} from "../../domain/entities/User";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { HttpClient } from "../http/HttpClient";
import type { TokenStorage } from "../storage/TokenStorage";

/**
 * Auth Repository Implementation
 *
 * Implementação concreta do repositório de autenticação.
 * Realiza chamadas HTTP para a API de autenticação.
 */
export class AuthRepositoryImpl implements IAuthRepository {
	constructor(
		private readonly httpClient: HttpClient,
		private readonly tokenStorage: TokenStorage,
	) {}

	/**
	 * Realiza login
	 */
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await this.httpClient.post<AuthResponse>(
			"/auth/login",
			credentials,
		);

		// Salva token e usuário
		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(response.user);
		this.httpClient.setToken(response.token);

		return response;
	}

	/**
	 * Registra novo usuário
	 */
	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await this.httpClient.post<AuthResponse>(
			"/auth/register",
			data,
		);

		// Salva token e usuário
		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(response.user);
		this.httpClient.setToken(response.token);

		return response;
	}

	/**
	 * Faz logout
	 */
	async logout(): Promise<void> {
		try {
			// Tenta invalidar token no servidor
			await this.httpClient.post("/auth/logout");
		} finally {
			// Remove dados locais mesmo se a API falhar
			this.tokenStorage.clear();
			this.httpClient.clearToken();
		}
	}

	/**
	 * Valida token atual
	 */
	async validateToken(): Promise<boolean> {
		try {
			const token = this.tokenStorage.getToken();
			if (!token) return false;

			// Verifica token no servidor
			await this.httpClient.get("/auth/validate");
			return true;
		} catch {
			// Token inválido ou expirado
			this.tokenStorage.clear();
			return false;
		}
	}
}
