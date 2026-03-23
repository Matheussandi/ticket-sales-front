/**
 * User Storage
 *
 * Persiste apenas snapshot do usuário (localStorage) para hidratação da UI.
 * A sessão real é o cookie httpOnly enviado automaticamente pelo browser.
 */
export class UserStorage {
	private readonly USER_KEY = "@tickethub:user";

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
		this.removeUser();
	}
}
