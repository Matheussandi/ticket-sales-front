/**
 * Token Storage
 *
 * Gerencia persistência de tokens de autenticação no localStorage.
 * Abstrai a camada de armazenamento para facilitar testes e mudanças futuras.
 */
export class TokenStorage {
	private readonly TOKEN_KEY = "@tickethub:token";
	private readonly USER_KEY = "@tickethub:user";

	/**
	 * Salva token no localStorage
	 */
	saveToken(token: string): void {
		localStorage.setItem(this.TOKEN_KEY, token);
	}

	/**
	 * Obtém token do localStorage
	 */
	getToken(): string | null {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	/**
	 * Remove token do localStorage
	 */
	removeToken(): void {
		localStorage.removeItem(this.TOKEN_KEY);
	}

	/**
	 * Salva dados do usuário no localStorage
	 */
	saveUser(user: unknown): void {
		localStorage.setItem(this.USER_KEY, JSON.stringify(user));
	}

	/**
	 * Obtém dados do usuário do localStorage
	 */
	getUser<T>(): T | null {
		const user = localStorage.getItem(this.USER_KEY);
		return user ? JSON.parse(user) : null;
	}

	/**
	 * Remove dados do usuário do localStorage
	 */
	removeUser(): void {
		localStorage.removeItem(this.USER_KEY);
	}

	/**
	 * Remove todos os dados de autenticação
	 */
	clear(): void {
		this.removeToken();
		this.removeUser();
	}

	/**
	 * Verifica se existe token armazenado
	 */
	hasToken(): boolean {
		return this.getToken() !== null;
	}
}
