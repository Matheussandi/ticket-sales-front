import { useEffect, useState } from "react";

import type { User } from "@/domain/entities/User";
import type { AuthService } from "@/domain/services/AuthService";

/**
 * Carrega sessão via `validateSession()` (ex.: GET /auth/me) no cliente.
 * `useEffect` não executa no SSR — não há chamada à API no Node sem cookies.
 */
export function useAuthBootstrap(authService: AuthService) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		void (async () => {
			try {
				const sessionUser = await authService.validateSession();
				if (!cancelled) {
					setUser(sessionUser ?? null);
				}
			} catch (error) {
				console.error("Erro ao validar sessão:", error);
				if (!cancelled) {
					setUser(null);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [authService]);

	return { user, setUser, isLoading, setIsLoading };
}
