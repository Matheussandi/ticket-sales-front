import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
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
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<main className="flex flex-1 flex-col p-4 md:p-6">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
