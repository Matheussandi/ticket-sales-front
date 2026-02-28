import type {
	AuthResponse,
	LoginCredentials,
	RegisterCustomerData,
	RegisterData,
	RegisterPartnerData,
	UpdatePasswordData,
	UpdateProfileData,
	User,
} from "../../domain/entities/User";

import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { decodeJwtToken } from "../../domain/utils/jwtDecoder";
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

		const payload = decodeJwtToken(response.token);

		const user: User = {
			id: payload.id.toString(),
			name: payload.name,
			email: payload.email,
			role: payload.role,
		};

		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(user);
		this.httpClient.setToken(response.token);

		return { token: response.token, user };
	}

	async register(data: RegisterData): Promise<AuthResponse> {
		const response = await this.httpClient.post<AuthResponse>(
			"/auth/register",
			data,
		);

		const payload = decodeJwtToken(response.token);
		const user: User = {
			id: payload.id.toString(),
			name: payload.name,
			email: payload.email,
			role: payload.role,
		};

		this.tokenStorage.saveToken(response.token);
		this.tokenStorage.saveUser(user);
		this.httpClient.setToken(response.token);

		return { token: response.token, user };
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

		const user: User = {
			id: response.user_id.toString(),
			name: response.name,
			email: data.email,
			role: "partner",
			company_name: response.company_name,
			createdAt: new Date(response.created_at),
		};

		const authResponse: AuthResponse = {
			user,
			token: "",
		};

		this.tokenStorage.saveUser(user);

		return authResponse;
	}

	async registerCustomer(data: RegisterCustomerData): Promise<AuthResponse> {
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

		const user: User = {
			id: response.user_id.toString(),
			name: response.name,
			email: data.email,
			role: "customer",
			address: response.address,
			phone: response.phone,
			createdAt: new Date(response.created_at),
		};

		const authResponse: AuthResponse = {
			user,
			token: "",
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

	async updateProfile(data: UpdateProfileData): Promise<User> {
		const response = await this.httpClient.put<User>("/profile", data);

		const currentUser = this.tokenStorage.getUser<User>();
		const updatedUser: User = {
			...(currentUser || {}),
			...response,
		} as User;

		this.tokenStorage.saveUser(updatedUser);
		return updatedUser;
	}

	async updatePassword(data: UpdatePasswordData): Promise<void> {
		await this.httpClient.put("/profile/password", {
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
		});
	}
}
