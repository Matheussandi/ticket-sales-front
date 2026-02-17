import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, Mail, Ticket } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	type ForgotPasswordFormData,
	forgotPasswordSchema,
} from "@/domain/entities/User";
import { useForgotPassword } from "@/hooks/mutations/useForgotPassword";


export const Route = createFileRoute("/esqueci-senha")({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	const [emailSent, setEmailSent] = useState(false);
	const forgotPassword = useForgotPassword();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		getValues,
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			await forgotPassword.mutateAsync(data);
			setEmailSent(true);
			toast.success("Email de recuperação enviado com sucesso!");
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Erro ao enviar email de recuperação";
			setError("root", {
				message: errorMessage,
			});
			toast.error(errorMessage);
		}
	};

	if (emailSent) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-md">
					<div className="text-center mb-8">
						<div className="inline-flex items-center gap-2 mb-4">
							<Ticket className="w-8 h-8" />
							<span className="text-2xl font-bold">TicketHub</span>
						</div>
					</div>

					<Card>
						<CardHeader>
							<div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
								<Mail className="w-6 h-6 text-primary" />
							</div>
							<CardTitle className="text-2xl text-center">
								Email Enviado!
							</CardTitle>
							<CardDescription className="text-center">
								Verifique sua caixa de entrada
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground text-center">
								Enviamos um link de recuperação para{" "}
								<span className="font-medium text-foreground">
									{getValues("email")}
								</span>
							</p>
							<p className="text-sm text-muted-foreground text-center">
								O link expira em 1 hora. Se você não recebeu o email, verifique
								sua pasta de spam.
							</p>
						</CardContent>
						<CardFooter className="flex-col space-y-4">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setEmailSent(false)}
							>
								Enviar novamente
							</Button>
						</CardFooter>
					</Card>

					<div className="mt-8 text-center">
						<Link
							to="/login"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							← Voltar para login
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-2 mb-4">
						<Ticket className="w-8 h-8" />
						<span className="text-2xl font-bold">TicketHub</span>
					</div>
					<h1 className="text-3xl font-bold mb-2">Esqueci minha senha</h1>
					<p className="text-muted-foreground">
						Digite seu email para receber um link de recuperação
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Recuperar Senha</CardTitle>
						<CardDescription>
							Enviaremos um link para redefinir sua senha
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							{errors.root && (
								<div className="rounded-md bg-destructive/15 p-3">
									<p className="text-sm text-destructive">{errors.root.message}</p>
								</div>
							)}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Controller
									name="email"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="email"
											type="email"
											placeholder="seu@email.com"
											autoComplete="email"
										/>
									)}
								/>
								{errors.email && (
									<p className="text-sm text-destructive">
										{errors.email.message}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									"Enviando..."
								) : (
									<>
										<KeyRound className="mr-2 h-4 w-4" />
										Enviar Link de Recuperação
									</>
								)}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex-col space-y-4">
						<div className="text-sm text-muted-foreground text-center">
							Lembrou da senha?{" "}
							<Link
								to="/login"
								className="font-medium hover:underline transition-colors"
							>
								Fazer login
							</Link>
						</div>
					</CardFooter>
				</Card>

				<div className="mt-8 text-center">
					<Link
						to="/"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						← Voltar para a página inicial
					</Link>
				</div>
			</div>
		</div>
	);
}
