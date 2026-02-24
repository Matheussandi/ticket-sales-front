import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../data/di/container";
import type { UpdateProfileData } from "../../domain/entities/User";

/**
 * Hook para atualizar perfil do usuário
 * Usa TanStack Query para gerenciar estado da mutation
 */
export function useUpdateProfile() {
	const { updateUser } = useAuth();

	return useMutation({
		mutationFn: (data: UpdateProfileData) => authService.updateProfile(data),
		onSuccess: (updatedUser) => {
			// Atualiza o contexto com os novos dados
			updateUser(updatedUser);
		},
	});
}
