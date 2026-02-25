import { useMutation } from "@tanstack/react-query";
import { authService } from "../../data/di/container";
import type { UpdatePasswordData } from "../../domain/entities/User";

/**
 * Hook para atualizar senha do usuário
 * Usa TanStack Query para gerenciar estado da mutation
 */
export function useUpdatePassword() {
	return useMutation({
		mutationFn: (data: UpdatePasswordData) =>
			authService.updatePassword(data),
	});
}
