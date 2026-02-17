import type {
	AuthResponse,
	LoginCredentials,
	RegisterCustomerData,
	RegisterData,
	RegisterPartnerData,
	User,
} from "../../domain/entities/User";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { extractRoleFromToken } from "../../domain/utils/jwtDecoder";
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

		const role = extractRoleFromToken(response.token);

		const userWithRole: User = {
			...response.user,
			role,
		};

		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(userWithRole);
		this.httpClient.setToken(response.token);

		return {
			...response,
			user: userWithRole,
		};
	}

	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await this.httpClient.post<AuthResponse>(
			"/auth/register",
			data,
		);

		const role = extractRoleFromToken(response.token);

		const userWithRole: User = {
			...response.user,
			role,
		};

		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(userWithRole);
		this.httpClient.setToken(response.token);

		return {
			...response,
			user: userWithRole,
		};
	}

	async registerPartner(data: RegisterPartnerData): Promise<AuthResponse> {
		interface PartnerRegisterResponse {
			id: number;
			name: string;
			user_id: number;
			company_name: string;
			created_at: string;
		}

		const response = await this.httpClient.post<PartnerRegisterResponse>(
			"/partners/register",
			data,
		);

		// Transform to User entity
		const user: User = {
			id: response.user_id.toString(),
			name: response.name,
			email: data.email,
			role: "partner",
			company_name: response.company_name,
			createdAt: new Date(response.created_at),
		};

		// Note: The API doesn't return a token for partner registration
		// We'll need to login after registration or adjust this based on actual API behavior
		const authResponse: AuthResponse = {
			user,
			token: "", // TODO: Get token from API or perform login after registration
		};

		this.tokenStorage.saveUser(user);

		return authResponse;
	}

	async registerCustomer(data: RegisterCustomerData): Promise<AuthResponse> {
		// API response structure for customer registration
		interface CustomerRegisterResponse {
			id: number;
			name: string;
			user_id: number;
			address: string;
			phone: string;
			created_at: string;
		}

		const response = await this.httpClient.post<CustomerRegisterResponse>(
			"/customers/register",
			data,
		);

		// Transform to User entity
		const user: User = {
			id: response.user_id.toString(),
			name: response.name,
			email: data.email,
			role: "customer",
			address: response.address,
			phone: response.phone,
			createdAt: new Date(response.created_at),
		};

		// Note: The API doesn't return a token for customer registration
		// We'll need to login after registration or adjust this based on actual API behavior
		const authResponse: AuthResponse = {
			user,
			token: "", // TODO: Get token from API or perform login after registration
		};

		this.tokenStorage.saveUser(user);

		return authResponse;
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
