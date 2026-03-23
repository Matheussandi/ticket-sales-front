import { z } from "zod";

import {
	type AuthResponse,
	authLoginFlatResponseSchema,
	authLoginResponseSchema,
	authMeResponseSchema,
	type LoginCredentials,
	type RegisterCustomerData,
	type RegisterData,
	type RegisterPartnerData,
	type UpdatePasswordData,
	type UpdateProfileData,
	type User,
	userSchema,
} from "../../domain/entities/User";

import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { HttpClient } from "../http/HttpClient";

import type { UserStorage } from "../storage/UserStorage";

function userFromFlat(data: z.infer<typeof authLoginFlatResponseSchema>): User {
	return {
		id: typeof data.id === "number" ? data.id : Number(data.id),
		name: data.name,
		email: data.email,
		role: data.role,
	};
}

function parseUserFromLoginBody(raw: unknown): User | null {
	const wrapped = authLoginResponseSchema.safeParse(raw);
	if (wrapped.success) {
		return wrapped.data.user;
	}
	const flat = authLoginFlatResponseSchema.safeParse(raw);
	if (flat.success) {
		return userFromFlat(flat.data);
	}
	return null;
}

/**
 * Auth Repository Implementation
 *
 * Implementação concreta do repositório de autenticação.
 * Realiza chamadas HTTP para a API de autenticação.
 */
export class AuthRepositoryImpl implements IAuthRepository {
	constructor(
		private readonly httpClient: HttpClient,
		private readonly userStorage: UserStorage,
	) {}

	/**
	 * GET /auth/me — cookie de sessão (withCredentials no HttpClient).
	 * 200 + { user } = autenticado; 401 = sem sessão (sem redirect global).
	 */
	private async fetchMeUser(): Promise<User | null> {
		try {
			const raw = await this.httpClient.get<unknown>("/auth/me", {
				skipUnauthorizedRedirect: true,
			});
			const parsed = authMeResponseSchema.safeParse(raw);
			return parsed.success ? parsed.data.user : null;
		} catch {
			return null;
		}
	}

	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const raw = await this.httpClient.post<unknown>("/auth/login", credentials);

		let user = parseUserFromLoginBody(raw);
		if (!user) {
			user = await this.fetchMeUser();
		}
		if (!user) {
			throw new Error("Resposta de login inválida");
		}

		return { user };
	}

	async register(data: RegisterData): Promise<AuthResponse> {
		const raw = await this.httpClient.post<unknown>("/auth/register", data);

		let user = parseUserFromLoginBody(raw);
		if (!user) {
			user = await this.fetchMeUser();
		}
		if (!user) {
			throw new Error("Resposta de registro inválida");
		}

		return { user };
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
			id: response.user_id,
			name: response.name,
			email: data.email,
			role: "partner",
			company_name: response.company_name,
			createdAt: new Date(response.created_at),
		};

		return { user };
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
			id: response.user_id,
			name: response.name,
			email: data.email,
			role: "customer",
			address: response.address,
			phone: response.phone,
			createdAt: new Date(response.created_at),
		};

		return { user };
	}

	async logout(): Promise<void> {
		try {
			await this.httpClient.post("/auth/logout");
		} finally {
			this.userStorage.clear();
		}
	}

	async validateSession(): Promise<User | null> {
		const user = await this.fetchMeUser();
		if (!user) {
			this.userStorage.clear();
		}
		return user;
	}

	async updateProfile(data: UpdateProfileData): Promise<User> {
		const response = await this.httpClient.put<unknown>("/profile", data);
		const parsed = userSchema.safeParse(response);
		if (!parsed.success) {
			throw new Error("Resposta de atualização de perfil inválida");
		}
		return parsed.data;
	}

	async updatePassword(data: UpdatePasswordData): Promise<void> {
		await this.httpClient.put("/profile/password", {
			currentPassword: data.currentPassword,
			newPassword: data.newPassword,
		});
	}
}
