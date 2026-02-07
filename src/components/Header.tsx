import { Link } from '@tanstack/react-router'
import { LogIn, LogOut, Ticket, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logout realizado com sucesso!')
    } catch {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <header className="p-4 flex items-center justify-between border-b shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Ticket className="w-6 h-6" />
            <span>TicketHub</span>
          </Link>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/cadastro">
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar
              </Link>
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm font-medium">
              Olá, {user?.name}
            </span>
            <Button onClick={handleLogout} variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
