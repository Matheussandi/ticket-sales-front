import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Shield,
  Star,
  Ticket,
  Users,
} from 'lucide-react'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const features = [
    {
      icon: <Ticket className="w-12 h-12 text-foreground" />,
      title: 'Ingressos Digitais',
      description:
        'Compre e gerencie seus ingressos de forma 100% digital. Acesse pelo celular de qualquer lugar.',
    },
    {
      icon: <Shield className="w-12 h-12 text-foreground" />,
      title: 'Compra Segura',
      description:
        'Pagamento protegido e criptografado. Sua segurança é nossa prioridade.',
    },
    {
      icon: <Calendar className="w-12 h-12 text-foreground" />,
      title: 'Diversos Eventos',
      description:
        'Shows, teatros, festivais, esportes e muito mais. Encontre o evento perfeito para você.',
    },
    {
      icon: <Star className="w-12 h-12 text-foreground" />,
      title: 'Experiências Exclusivas',
      description:
        'Acesso a eventos VIP, meet & greet e experiências únicas que você não encontra em outro lugar.',
    },
    {
      icon: <Users className="w-12 h-12 text-foreground" />,
      title: 'Compra em Grupo',
      description:
        'Compre ingressos para você e seus amigos de uma só vez. Garanta os melhores lugares juntos.',
    },
    {
      icon: <CreditCard className="w-12 h-12 text-foreground" />,
      title: 'Pagamento Facilitado',
      description:
        'Parcelamento em até 12x sem juros. Aceitamos cartão, PIX e outras formas de pagamento.',
    },
  ]

  const benefits = [
    'Ingressos enviados instantaneamente por email',
    'Suporte ao cliente 24/7',
    'Garantia de reembolso',
    'Sem taxas ocultas',
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden border-b">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border rounded-full mb-8">
            <Ticket className="w-4 h-4" />
            <span className="text-sm font-medium">
              A melhor plataforma de venda de ingressos
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Seu ingresso para
            <br />
            <span className="underline decoration-4 underline-offset-8">
              experiências incríveis
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-light max-w-3xl mx-auto">
            Compre ingressos para shows, festivais, teatros e eventos esportivos de forma rápida, segura e sem complicação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button asChild size="lg" className="text-lg px-8">
              <a href="#eventos">
                Explorar Eventos
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link to="/cadastro">
                Criar Conta Grátis
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto" id="eventos">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Por que escolher nossa plataforma?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tecnologia de ponta para garantir a melhor experiência na compra dos seus ingressos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg group"
            >
              <CardContent className="p-6">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-primary text-primary-foreground border-none shadow-2xl">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para viver experiências inesquecíveis?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Cadastre-se agora e tenha acesso aos melhores eventos da sua região. É rápido, fácil e gratuito!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                  <Link to="/cadastro">
                    Criar Conta Grátis
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <Link to="/login">
                    Já tenho conta
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="w-6 h-6" />
                <span className="text-xl font-bold">TicketHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                A plataforma completa para compra de ingressos online.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Eventos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Shows</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Festivais</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Teatro</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Esportes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Políticas</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <Separator className="mb-8" />
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TicketHub. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
