import type { AuthResponse, LoginCredentials, RegisterData } from "../entities/User";

/**
 * Auth Repository Interface
 *
 * Define o contrato para operações de autenticação.
 * Segue o princípio de Inversão de Dependência (DIP).
 */
export interface IAuthRepository {
	/**
	 * Realiza login com credenciais
	 * @throws {Error} Se credenciais forem inválidas
	 */
	login(credentials: LoginCredentials): Promise<AuthResponse>;

	/**
	 * Registra novo usuário
	 * @throws {Error} Se email já estiver em uso
	 */
	register(data: RegisterData): Promise<AuthResponse>;

	/**
	 * Faz logout (invalida token no servidor)
	 */
	logout(): Promise<void>;

	/**
	 * Verifica se usuário está autenticado (valida token)
	 */
	validateToken(): Promise<boolean>;
}
