import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Building2, Ticket, User as UserIcon, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { 
  type RegisterCustomerFormData,
  type RegisterPartnerFormData, 
  registerCustomerSchema, 
  registerPartnerSchema
} from '@/domain/entities/User'
import { formatPhone } from '@/utils/formatters'

export const Route = createFileRoute('/cadastro')({
  component: CadastroPage,
})

type UserType = 'partner' | 'customer'

function CadastroPage() {
  const navigate = useNavigate()
  const { registerPartner, registerCustomer } = useAuth()
  const [userType, setUserType] = useState<UserType>('customer')

  const partnerForm = useForm<RegisterPartnerFormData>({
    resolver: zodResolver(registerPartnerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company_name: '',
    },
  })

  const customerForm = useForm<RegisterCustomerFormData>({
    resolver: zodResolver(registerCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phone: '',
    },
  })

  const onSubmitPartner = async (data: RegisterPartnerFormData) => {
    try {
      await registerPartner({
        name: data.name,
        email: data.email,
        password: data.password,
        company_name: data.company_name,
      })
      
      toast.success('Conta criada com sucesso!')
      navigate({ to: '/dashboard' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta'
      partnerForm.setError('root', {
        message: errorMessage,
      })
      toast.error(errorMessage)
    }
  }

  const onSubmitCustomer = async (data: RegisterCustomerFormData) => {
    try {
      await registerCustomer({
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        phone: data.phone,
      })
      
      toast.success('Conta criada com sucesso!')
      // Registro bem-sucedido, redireciona para dashboard
      navigate({ to: '/dashboard' })
    } catch (error) {
      // Exibe erro no formulário
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta'
      customerForm.setError('root', {
        message: errorMessage,
      })
      toast.error(errorMessage)
    }
  }

  const currentForm = userType === 'partner' ? partnerForm : customerForm
  const currentErrors = currentForm.formState.errors
  const isSubmitting = currentForm.formState.isSubmitting

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
          <p className="text-muted-foreground">
            Cadastre-se gratuitamente e tenha acesso aos melhores eventos
          </p>
        </div>

        <Card>
          {currentErrors.root && (
            <div className="rounded-md bg-destructive/15 p-3 mx-6 mt-6">
              <p className="text-sm text-destructive">{currentErrors.root.message}</p>
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-2xl">Cadastro</CardTitle>
            <CardDescription>
              Selecione o tipo de conta e preencha os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* User Type Selection */}
            <div className="space-y-4 mb-6">
              <Label>Tipo de conta</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                    userType === 'customer'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <UserIcon className="w-8 h-8" />
                  <span className="font-medium">Cliente</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('partner')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-colors ${
                    userType === 'partner'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Building2 className="w-8 h-8" />
                  <span className="font-medium">Parceiro</span>
                </button>
              </div>
            </div>

            {/* Partner Form */}
            {userType === 'partner' && (
              <form onSubmit={partnerForm.handleSubmit(onSubmitPartner)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partner-name">Nome completo</Label>
                  <Controller
                    name="name"
                    control={partnerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="partner-name"
                        type="text"
                        placeholder="João Silva"
                      />
                    )}
                  />
                  {partnerForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {partnerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-email">Email</Label>
                  <Controller
                    name="email"
                    control={partnerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="partner-email"
                        type="email"
                        placeholder="seu@email.com"
                      />
                    )}
                  />
                  {partnerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {partnerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-company">Nome da empresa</Label>
                  <Controller
                    name="company_name"
                    control={partnerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="partner-company"
                        type="text"
                        placeholder="Minha Empresa Ltda"
                      />
                    )}
                  />
                  {partnerForm.formState.errors.company_name && (
                    <p className="text-sm text-destructive">
                      {partnerForm.formState.errors.company_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-password">Senha</Label>
                  <Controller
                    name="password"
                    control={partnerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="partner-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    )}
                  />
                  {partnerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {partnerForm.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partner-confirmPassword">Confirmar senha</Label>
                  <Controller
                    name="confirmPassword"
                    control={partnerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="partner-confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    )}
                  />
                  {partnerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {partnerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Criando conta...'
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Customer Form */}
            {userType === 'customer' && (
              <form onSubmit={customerForm.handleSubmit(onSubmitCustomer)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Nome completo</Label>
                  <Controller
                    name="name"
                    control={customerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="customer-name"
                        type="text"
                        placeholder="João Silva"
                      />
                    )}
                  />
                  {customerForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {customerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Controller
                    name="email"
                    control={customerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="customer-email"
                        type="email"
                        placeholder="seu@email.com"
                      />
                    )}
                  />
                  {customerForm.formState.errors.email && (
                    <p className="text-sm text-destructive">
                      {customerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-address">Endereço</Label>
                  <Controller
                    name="address"
                    control={customerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="customer-address"
                        type="text"
                        placeholder="Rua Example, 123"
                      />
                    )}
                  />
                  {customerForm.formState.errors.address && (
                    <p className="text-sm text-destructive">
                      {customerForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-phone">Telefone</Label>
                  <Controller
                    name="phone"
                    control={customerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="customer-phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={15}
                        placeholder="(11) 99999-9999"
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                      />
                    )}
                  />
                  {customerForm.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {customerForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-password">Senha</Label>
                  <Controller
                    name="password"
                    control={customerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="customer-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    )}
                  />
                  {customerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">
                      {customerForm.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Mínimo 8 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer-confirmPassword">Confirmar senha</Label>
                  <Controller
                    name="confirmPassword"
                    control={customerForm.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="customer-confirmPassword"
                        type="password"
                        placeholder="••••••••"
                      />
                    )}
                  />
                  {customerForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {customerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Criando conta...'
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="#" className="hover:underline">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="#" className="hover:underline">
                Política de Privacidade
              </a>
            </p>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline transition-colors"
              >
                Faça login
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
  )
}
