/**
 * Token Storage
 *
 * Gerencia persistência de tokens de autenticação no localStorage.
 * Abstrai a camada de armazenamento para facilitar testes e mudanças futuras.
 */
export class TokenStorage {
	private readonly TOKEN_KEY = "@tickethub:token";
	private readonly USER_KEY = "@tickethub:user";

	saveToken(token: string): void {
		localStorage.setItem(this.TOKEN_KEY, token);
	}

	getToken(): string | null {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	removeToken(): void {
		localStorage.removeItem(this.TOKEN_KEY);
	}

	saveUser(user: unknown): void {
		localStorage.setItem(this.USER_KEY, JSON.stringify(user));
	}

	getUser<T>(): T | null {
		const user = localStorage.getItem(this.USER_KEY);
		return user ? JSON.parse(user) : null;
	}

	removeUser(): void {
		localStorage.removeItem(this.USER_KEY);
	}

	clear(): void {
		this.removeToken();
		this.removeUser();
	}

	hasToken(): boolean {
		return this.getToken() !== null;
	}
}
