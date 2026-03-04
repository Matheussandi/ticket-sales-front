import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, User as UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/contexts/AuthContext";
import {
	type UpdatePasswordData,
	type UpdateProfileData,
	updatePasswordSchema,
	updateProfileSchema,
} from "@/domain/entities/User";
import { useUpdatePassword } from "@/hooks/mutations/useUpdatePassword";
import { useUpdateProfile } from "@/hooks/mutations/useUpdateProfile";
import { formatPhone } from "@/utils/formatters";

export const Route = createFileRoute("/_authenticated/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const { user } = useAuth();
	const updateProfileMutation = useUpdateProfile();
	const updatePasswordMutation = useUpdatePassword();

	// Form de atualização de perfil
	const profileForm = useForm<UpdateProfileData>({
		// @ts-expect-error - Conflito de versões entre Zod 4.x e @hookform/resolvers que espera Zod 3.x
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			phone: user?.phone || "",
		},
	});

	// Form de atualização de senha
	const passwordForm = useForm<UpdatePasswordData>({
		// @ts-expect-error - Conflito de versões entre Zod 4.x e @hookform/resolvers que espera Zod 3.x
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmitProfile = async (data: UpdateProfileData) => {
		try {
			await updateProfileMutation.mutateAsync(data);
			toast.success("Perfil atualizado com sucesso!");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao atualizar perfil",
			);
		}
	};

	const onSubmitPassword = async (data: UpdatePasswordData) => {
		try {
			await updatePasswordMutation.mutateAsync(data);
			toast.success("Senha alterada com sucesso!");
			passwordForm.reset();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Erro ao alterar senha",
			);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">Perfil</h1>
				<p className="text-muted-foreground mt-1">
					Gerencie suas informações pessoais e segurança
				</p>
			</div>

			{/* Informações Pessoais */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<UserIcon className="h-5 w-5" />
						<CardTitle>Informações Pessoais</CardTitle>
					</div>
					<CardDescription>
						Atualize seu nome e email de acesso
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...profileForm}>
						<form
							onSubmit={profileForm.handleSubmit(onSubmitProfile)}
							className="space-y-4"
						>
							<FormField
								control={profileForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input placeholder="Seu nome completo" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={profileForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="seu@email.com"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						<FormField
							control={profileForm.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Telefone</FormLabel>
									<FormControl>
										<Input
											type="tel"
											inputMode="numeric"
											maxLength={15}
											placeholder="(11) 99999-9999"
											{...field}
											onChange={(e) => field.onChange(formatPhone(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
							<div className="flex justify-end">
								<Button
									type="submit"
									disabled={updateProfileMutation.isPending}
								>
									{updateProfileMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Salvando...
										</>
									) : (
										"Salvar Alterações"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			{/* Segurança */}
			<Card>
				<CardHeader>
					<CardTitle>Segurança</CardTitle>
					<CardDescription>Altere sua senha de acesso</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...passwordForm}>
						<form
							onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
							className="space-y-4"
						>
							<FormField
								control={passwordForm.control}
								name="currentPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Senha Atual</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Sua senha atual"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={passwordForm.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nova Senha</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Mínimo 6 caracteres"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={passwordForm.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar Nova Senha</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Repita a nova senha"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end">
								<Button
									type="submit"
									disabled={updatePasswordMutation.isPending}
								>
									{updatePasswordMutation.isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Alterando...
										</>
									) : (
										"Alterar Senha"
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
