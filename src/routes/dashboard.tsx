import { createFileRoute } from '@tanstack/react-router'
import { Construction, Ticket } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie seus eventos e ingressos de forma simples e eficiente.
          </p>
        </div>

        {/* Under Construction Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Dashboard em Construção</CardTitle>
            <CardDescription className="text-base mt-2">
              Estamos trabalhando para trazer a melhor experiência para você
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Em breve você terá acesso a:
            </p>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Visualização de todos os seus eventos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Gestão de ingressos e vendas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Relatórios e análises detalhadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Configurações de perfil e preferências</span>
              </li>
            </ul>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground italic">
                Enquanto isso, agradecemos sua paciência! 🚀
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
