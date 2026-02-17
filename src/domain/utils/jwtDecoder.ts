import { jwtDecode } from "jwt-decode";

/**
 * Interface do payload JWT retornado pela API
 */
export interface JwtPayload {
	id: number;
	email: string;
	role: string;
	iat: number;
	exp: number;
}

/**
 * Decodifica um token JWT e retorna o payload tipado
 * @param token - Token JWT a ser decodificado
 * @returns Payload do JWT decodificado
 * @throws Erro se o token for inválido
 */
export function decodeJwtToken(token: string): JwtPayload {
	try {
		return jwtDecode<JwtPayload>(token);
	} catch (error) {
		console.error("Erro ao decodificar token JWT:", error);
		throw new Error("Token JWT inválido");
	}
}

/**
 * Extrai o role do token JWT
 * @param token - Token JWT
 * @returns Role do usuário ou "customer" como default
 */
export function extractRoleFromToken(token: string): "partner" | "customer" {
	try {
		const payload = decodeJwtToken(token);
		const role = payload.role?.toLowerCase();

		if (role === "partner" || role === "customer") {
			return role;
		}

		return "customer";
	} catch {
		return "customer";
	}
}

/**
 * Verifica se o token JWT está expirado
 * @param token - Token JWT
 * @returns true se o token está expirado
 */
export function isTokenExpired(token: string): boolean {
	try {
		const payload = decodeJwtToken(token);
		const currentTime = Math.floor(Date.now() / 1000);
		return payload.exp < currentTime;
	} catch {
		return true;
	}
}
