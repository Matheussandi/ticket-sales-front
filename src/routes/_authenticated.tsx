import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Layout para rotas autenticadas
export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		// Verificar se o usuário está autenticado
		// Como não temos acesso ao AuthContext aqui, vamos verificar o token no localStorage
		const token = localStorage.getItem("@tickethub:token");

		if (!token) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full">
				<AppSidebar />
				<SidebarInset className="flex-1">
					<main className="flex-1 p-6">
						<Outlet />
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
