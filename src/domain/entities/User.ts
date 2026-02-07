import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	userType: z.enum(["partner", "customer"]),
	company_name: z.string().optional(),
	address: z.string().optional(),
	phone: z.string().optional(),
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

export const registerPartnerRequestSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.min(3, "Nome deve ter no mínimo 3 caracteres"),
	email: z.string().min(1, "Email é obrigatório"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "Senha deve ter no mínimo 8 caracteres"),
	company_name: z
		.string()
		.min(1, "Nome da empresa é obrigatório")
		.min(3, "Nome da empresa deve ter no mínimo 3 caracteres"),
});

export const registerCustomerRequestSchema = z.object({
	name: z
		.string()
		.min(1, "Nome é obrigatório")
		.min(3, "Nome deve ter no mínimo 3 caracteres"),
	email: z.string().min(1, "Email é obrigatório"),
	password: z
		.string()
		.min(1, "Senha é obrigatória")
		.min(8, "Senha deve ter no mínimo 8 caracteres"),
	address: z.string().min(1, "Endereço é obrigatório"),
	phone: z.string().min(1, "Telefone é obrigatório"),
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

export const registerPartnerSchema = registerPartnerRequestSchema
	.extend({
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export const registerCustomerSchema = registerCustomerRequestSchema
	.extend({
		confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem",
		path: ["confirmPassword"],
	});

export type User = z.infer<typeof userSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterPartnerRequest = z.infer<typeof registerPartnerRequestSchema>;
export type RegisterCustomerRequest = z.infer<typeof registerCustomerRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterPartnerFormData = z.infer<typeof registerPartnerSchema>;
export type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>;
export type LoginCredentials = LoginRequest;
export type RegisterData = RegisterRequest;
export type RegisterPartnerData = RegisterPartnerRequest;
export type RegisterCustomerData = RegisterCustomerRequest;
