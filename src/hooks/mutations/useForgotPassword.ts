import { useMutation } from "@tanstack/react-query";
import type { ForgotPasswordFormData } from "@/domain/entities/User";

// TODO: Implementar no AuthRepository e AuthService quando o endpoint estiver disponível
export function useForgotPassword() {
	return useMutation({
		mutationFn: async (data: ForgotPasswordFormData) => {
			// Simulação de chamada à API
			// Em produção, isso deve ser implementado no AuthService
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Simula sucesso
			// TODO: Substituir por: await authService.forgotPassword(data.email)
			console.log("Email de recuperação enviado para:", data.email);
		},
	});
}
