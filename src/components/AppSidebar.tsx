import { Link, useMatchRoute } from "@tanstack/react-router";
import { Calendar, Home, LogOut, Ticket, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";

const menuItemsByRole = {
	partner: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: Home,
		},
		{
			title: "Eventos",
			url: "/events",
			icon: Calendar,
		},
		{
			title: "Perfil",
			url: "/profile",
			icon: User,
		},
	],
	customer: [
		{
			title: "Eventos",
			url: "/events",
			icon: Calendar,
		},
		{
			title: "Meus Ingressos",
			url: "/tickets",
			icon: Ticket,
		},
		{
			title: "Perfil",
			url: "/profile",
			icon: User,
		},
	],
};

/**
 * AppSidebar - Renderiza a sidebar com itens filtrados por role
 */
export function AppSidebar() {
	const { user, logout } = useAuth();
	const matchRoute = useMatchRoute();
	const role = useRole();

	const menuItems = menuItemsByRole[role];

	const handleLogout = async () => {
		try {
			await logout();
			toast.success("Logout realizado com sucesso!");
		} catch {
			toast.error("Erro ao fazer logout");
		}
	};

	return (
		<Sidebar>
			<SidebarHeader className="border-b p-4">
				<div className="flex items-center gap-2">
					<Calendar className="h-6 w-6" />
					<span className="text-lg font-semibold">TicketHub</span>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => {
								const isActive = matchRoute({ to: item.url });
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={!!isActive}>
											<Link to={item.url}>
												<item.icon className="h-4 w-4" />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t p-4">
				<div className="mb-3">
					<p className="text-sm font-medium">{user?.name}</p>
					<p className="text-xs text-muted-foreground">{user?.email}</p>
				</div>
				<Separator className="mb-3" />
				<Button
					onClick={handleLogout}
					variant="ghost"
					size="sm"
					className="w-full justify-start"
				>
					<LogOut className="mr-2 h-4 w-4" />
					Sair
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
