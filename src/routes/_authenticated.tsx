import {
	createFileRoute,
	Outlet,
	useNavigate,
	useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Rotas autenticadas: guard no cliente após hidratação (GET /auth/me roda no AuthContext).
 * Não usar beforeLoad com validateSession — no SSR não há cookie repassado ao axios.
 */
export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();
	const locationHref = useRouterState({ select: (s) => s.location.href });

	useEffect(() => {
		if (isLoading) {
			return;
		}
		if (!isAuthenticated) {
			void navigate({
				to: "/login",
				search: { redirect: locationHref },
			});
		}
	}, [isLoading, isAuthenticated, navigate, locationHref]);

	if (isLoading) {
		return (
			<div className="flex min-h-svh flex-1 flex-col items-center justify-center gap-4 p-8">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-64 w-full max-w-md" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

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
