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

	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await this.httpClient.post<AuthResponse>(
			"/auth/login",
			credentials,
		);

		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(response.user);
		this.httpClient.setToken(response.token);

		return response;
	}

	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await this.httpClient.post<AuthResponse>(
			"/auth/register",
			data,
		);

		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(response.user);
		this.httpClient.setToken(response.token);

		return response;
	}

	async logout(): Promise<void> {
		try {
			await this.httpClient.post("/auth/logout");
		} finally {
			this.tokenStorage.clear();
			this.httpClient.clearToken();
		}
	}

	async validateToken(): Promise<boolean> {
		try {
			const token = this.tokenStorage.getToken();
			if (!token) return false;

			await this.httpClient.get("/auth/validate");
			return true;
		} catch {
			this.tokenStorage.clear();
			return false;
		}
	}
}
