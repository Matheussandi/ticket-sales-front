import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	createdAt: z.coerce.date().optional(),
});

export const loginRequestSchema = z.object({
	email: z.string().min(1, "Email é obrigatório"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const registerRequestSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.min(3, "Nome deve ter no mínimo 3 caracteres"),
	email: z.string().min(1, "Email é obrigatório"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "Senha deve ter no mínimo 8 caracteres")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			"Senha deve conter letras maiúsculas, minúsculas e números",
		),
});

export const authResponseSchema = z.object({
	user: userSchema,
	token: z.string(),
});

export const loginSchema = loginRequestSchema;

export const registerSchema = registerRequestSchema
	.extend({
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginCredentials = LoginRequest;
export type RegisterData = RegisterRequest;
