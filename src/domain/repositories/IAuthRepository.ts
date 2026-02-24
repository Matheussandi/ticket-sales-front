import type { 
	AuthResponse, 
	LoginCredentials, 
	RegisterCustomerData, 
	RegisterData,
	RegisterPartnerData,
	UpdatePasswordData,
	UpdateProfileData,
	User
} from "../entities/User";

/**
 * Auth Repository Interface
 *
 * Define o contrato para operações de autenticação.
 * Segue o princípio de Inversão de Dependência (DIP).
 */
export interface IAuthRepository {
	login(credentials: LoginCredentials): Promise<AuthResponse>;
	register(data: RegisterData): Promise<AuthResponse>;
	registerPartner(data: RegisterPartnerData): Promise<AuthResponse>;
	registerCustomer(data: RegisterCustomerData): Promise<AuthResponse>;
	logout(): Promise<void>;
	validateToken(): Promise<boolean>;
	updateProfile(data: UpdateProfileData): Promise<User>;
	updatePassword(data: UpdatePasswordData): Promise<void>;
}
