import type {
	AuthResponse,
	LoginCredentials,
	RegisterCustomerData,
	RegisterData,
	RegisterPartnerData,
	UpdatePasswordData,
	UpdateProfileData,
	User,
} from "../entities/User";
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

	async registerPartner(data: RegisterPartnerData): Promise<AuthResponse> {
		try {
			const response = await this.authRepository.registerPartner(data);
			return response;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao registrar parceiro",
			);
		}
	}

	async registerCustomer(data: RegisterCustomerData): Promise<AuthResponse> {
		try {
			const response = await this.authRepository.registerCustomer(data);
			return response;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao registrar cliente",
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

	async validateSession(): Promise<User | null> {
		try {
			return await this.authRepository.validateSession();
		} catch {
			return null;
		}
	}

	async updateProfile(data: UpdateProfileData): Promise<User> {
		try {
			const user = await this.authRepository.updateProfile(data);
			return user;
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao atualizar perfil",
			);
		}
	}

	async updatePassword(data: UpdatePasswordData): Promise<void> {
		// Validação de negócio: nova senha não pode ser igual à atual
		if (data.currentPassword === data.newPassword) {
			throw new Error("A nova senha deve ser diferente da senha atual");
		}

		try {
			await this.authRepository.updatePassword(data);
		} catch (error) {
			throw new Error(
				error instanceof Error ? error.message : "Erro ao atualizar senha",
			);
		}
	}
}
