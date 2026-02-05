# Quick Start Guide - TicketHub

## 🚀 Início Rápido

Guia para desenvolvedores que estão começando no projeto.

---

## 📋 Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **pnpm** 8+ (`npm install -g pnpm`)
- **Git**

---

## ⚙️ Setup Inicial

### 1. Clonar e Instalar

```bash
# Clonar repositório
git clone <url-do-repo>
cd vendas-ingresso-front

# Instalar dependências
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar template
cp .env.example .env.development

# Editar conforme necessário
nano .env.development
```

**Variáveis importantes:**
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

### 3. Rodar em Desenvolvimento

```bash
pnpm dev
```

Acesse: **http://localhost:3000**

---

## 🗂️ Estrutura Rápida

```
src/
├── domain/           # Regras de negócio (entities, services)
├── data/             # Implementações (HTTP, repositories)
├── contexts/         # Estado global (AuthContext)
├── routes/           # Páginas
└── components/       # Componentes UI
```

---

## 🧭 Navegação no Código

### Como Fazer Login?

1. Ir para `/login`
2. Código em: `src/routes/login.tsx`
3. Usa: `useAuth()` hook
4. Hook definido em: `src/contexts/AuthContext.tsx`
5. Chama: `authService.login()` de `src/data/di/container.ts`

### Como Adicionar Nova Rota?

```bash
# Criar arquivo
touch src/routes/minha-rota.tsx
```

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/minha-rota')({
  component: MinhaRotaPage
});

function MinhaRotaPage() {
  return <div>Minha Rota</div>;
}
```

Acesse: `http://localhost:3000/minha-rota`

### Como Usar Autenticação em Componente?

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MeuComponente() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <p>Bem-vindo, {user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Como Criar Rota Protegida?

```typescript
import { useRequireAuth } from '@/contexts/AuthContext';

function DashboardPage() {
  const { user } = useRequireAuth(); // Redireciona se não autenticado

  return <div>Dashboard de {user.name}</div>;
}
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Rodar em modo dev (porta 3000)

# Build
pnpm build            # Build para produção

# Code Quality
pnpm lint             # Rodar linter (Biome)
pnpm format           # Formatar código (Biome)
pnpm check            # Lint + Format

# Adicionar Componente shadcn/ui
pnpm dlx shadcn@latest add <component>
# Exemplo: pnpm dlx shadcn@latest add dialog
```

---

## 🎨 Estilos (Tailwind CSS)

### Classes Utilitárias

```tsx
<div className="flex items-center justify-between p-4 bg-background">
  <h1 className="text-2xl font-bold text-foreground">Título</h1>
  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
    Botão
  </button>
</div>
```

### Cores do Tema

Use classes semânticas (não cores diretas):

```tsx
// ✅ Bom
<div className="bg-background text-foreground">...</div>
<button className="bg-primary text-primary-foreground">...</button>

// ❌ Evite
<div className="bg-white text-black">...</div>
<button className="bg-blue-500 text-white">...</button>
```

### Componentes shadcn/ui

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Título</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Clique aqui</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 📝 Formulários

### Exemplo com React Hook Form + Zod

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/domain/entities/User';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log(data);
    // Lógica de login aqui
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input {...field} type="email" />}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <Controller
          name="password"
          control={control}
          render={({ field }) => <Input {...field} type="password" />}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit">Entrar</Button>
    </form>
  );
}
```

---

## 🔌 Chamar API

### Não faça fetch diretamente!

❌ **Errado:**
```typescript
const response = await fetch('/api/events');
const data = await response.json();
```

✅ **Correto:** Use repositories

```typescript
// 1. Criar interface
// src/domain/repositories/IEventRepository.ts
export interface IEventRepository {
  getAll(): Promise<Event[]>;
}

// 2. Implementar
// src/data/repositories/EventRepositoryImpl.ts
export class EventRepositoryImpl implements IEventRepository {
  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Event[]> {
    return await this.httpClient.get<Event[]>('/events');
  }
}

// 3. Registrar no container
// src/data/di/container.ts
const eventRepository = new EventRepositoryImpl(httpClient);
export const eventService = new EventService(eventRepository);

// 4. Usar no componente via context/hook
const { events, loadEvents } = useEvents();
```

---

## 🐛 Debugging

### Ver Logs de HTTP

Abra o console do navegador e veja logs de requisições:

```
[HTTP] POST /auth/login 200
[HTTP Error] /auth/login Credenciais inválidas
```

### Inspecionar Estado de Auth

```typescript
function DebugAuth() {
  const auth = useAuth();
  
  return <pre>{JSON.stringify(auth, null, 2)}</pre>;
}
```

### DevTools

- **TanStack Router Devtools** - Canto inferior direito (ícone)
- **TanStack Query Devtools** - Mesmo painel
- **React DevTools** - Extensão do navegador

---

## 🚨 Problemas Comuns

### Erro: "useAuth deve ser usado dentro de AuthProvider"

**Causa:** Componente não está dentro do `<AuthProvider>`

**Solução:** Verificar se `__root.tsx` tem o provider:

```tsx
// src/routes/__root.tsx
<AuthProvider authService={authService}>
  {children}
</AuthProvider>
```

---

### Erro: "Missing environment variable: VITE_API_BASE_URL"

**Causa:** Arquivo `.env.development` não existe ou variável não definida

**Solução:**
```bash
cp .env.example .env.development
# Editar .env.development e adicionar VITE_API_BASE_URL
```

---

### Erro 401 em todas as requisições

**Causa:** Token inválido ou expirado

**Solução:**
```javascript
// No console do navegador:
localStorage.removeItem('@tickethub:token');
localStorage.removeItem('@tickethub:user');
// Fazer login novamente
```

---

### Formulário não valida

**Causa:** Schema Zod não está sendo aplicado

**Solução:** Verificar se `zodResolver` está configurado:

```typescript
const { control } = useForm({
  resolver: zodResolver(meuSchema) // ← Não esqueça!
});
```

---

## 📚 Próximos Passos

1. **Ler documentação completa:**
   - [CLEAN_ARCHITECTURE.md](./CLEAN_ARCHITECTURE.md) - Entender arquitetura
   - [API_INTEGRATION.md](./API_INTEGRATION.md) - Integração com backend
   - [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - Estrutura de pastas

2. **Explorar código:**
   - Ver `src/routes/login.tsx` - Exemplo de formulário
   - Ver `src/contexts/AuthContext.tsx` - Exemplo de context
   - Ver `src/data/di/container.ts` - Dependency injection

3. **Implementar feature:**
   - Escolha um módulo (Events, Tickets, Payments)
   - Siga o padrão: Entity → Repository → Service → Context → UI

---

## 🤝 Convenções

### Nomenclatura

- **Arquivos:** `PascalCase.tsx` (componentes), `camelCase.ts` (utils)
- **Pastas:** `kebab-case/` ou `camelCase/`
- **Componentes:** `PascalCase`
- **Funções:** `camelCase`
- **Constantes:** `UPPER_CASE`

### Imports

```typescript
// Usar path alias
import { User } from '@/domain/entities/User';      // ✅
import { User } from '../../../domain/entities/User'; // ❌

// Ordem de imports (Biome organiza automaticamente)
// 1. React
// 2. Bibliotecas externas
// 3. Aliases (@/)
// 4. Relativos (./)
```

### Comentários

```typescript
// ✅ Bom - explica POR QUE
// Validamos token no servidor pois localStorage pode ser manipulado
const isValid = await authService.validateToken();

// ❌ Ruim - explica O QUE (óbvio)
// Chama validateToken
const isValid = await authService.validateToken();
```

---

## 🎯 Checklist de PR

Antes de abrir Pull Request:

- [ ] Código compilando sem erros (`pnpm build`)
- [ ] Linter passou (`pnpm lint`)
- [ ] Formatação correta (`pnpm format`)
- [ ] Testes passando (quando houver)
- [ ] Sem `console.log` esquecidos
- [ ] Variáveis de ambiente documentadas
- [ ] README atualizado (se necessário)

---

## 📞 Ajuda

- **Dúvidas sobre arquitetura?** Leia `docs/CLEAN_ARCHITECTURE.md`
- **Erro de API?** Leia `docs/API_INTEGRATION.md`
- **Estrutura de pastas?** Leia `docs/FOLDER_STRUCTURE.md`

---

**Boa codificação! 🚀**
