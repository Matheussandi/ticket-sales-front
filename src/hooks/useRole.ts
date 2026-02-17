import { useAuth } from "../contexts/AuthContext";

/**
 * Hook para acessar o role do usuário autenticado
 * @returns Role do usuário ("partner" | "customer") ou "customer" como default
 */
export function useRole(): "partner" | "customer" {
	const { user } = useAuth();
	return user?.role || "customer";
}

/**
 * Hook para verificar se o usuário é um parceiro
 * @returns true se o usuário for um parceiro
 */
export function useIsPartner(): boolean {
	const role = useRole();
	return role === "partner";
}

/**
 * Hook para verificar se o usuário é um cliente
 * @returns true se o usuário for um cliente
 */
export function useIsCustomer(): boolean {
	const role = useRole();
	return role === "customer";
}
