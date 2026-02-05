import { z } from "zod";

/**
 * User Entity
 *
 * Representa um usuário autenticado no sistema.
 */
export interface User {
	id: string;
	name: string;
	email: string;
	createdAt?: Date;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
	email: string;
	password: string;
}

/**
 * Register Data
 */
export interface RegisterData {
	name: string;
	email: string;
	password: string;
}

/**
 * Auth Response
 *
 * Resposta da API após autenticação bem-sucedida.
 */
export interface AuthResponse {
	user: User;
	token: string;
}

// ============================================================================
// Validation Schemas (Zod)
// ============================================================================

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
	email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema de validação para cadastro
 */
export const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, "Nome é obrigatório")
			.min(3, "Nome deve ter no mínimo 3 caracteres"),
		email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
		password: z
			.string()
			.min(1, "Senha é obrigatória")
			.min(8, "Senha deve ter no mínimo 8 caracteres")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Senha deve conter letras maiúsculas, minúsculas e números",
			),
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;
