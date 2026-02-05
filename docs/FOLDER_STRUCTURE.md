# Estrutura de Pastas - TicketHub

## 📁 Árvore Completa

```
vendas-ingresso-front/
│
├── .env.development          # Variáveis de ambiente (desenvolvimento)
├── .env.production           # Variáveis de ambiente (produção)
├── .env.example              # Template de variáveis de ambiente
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
├── vite.config.ts            # Configuração Vite
├── biome.json                # Configuração Biome (linter/formatter)
├── components.json           # Configuração shadcn/ui
│
├── docs/                     # 📚 Documentação
│   ├── CLEAN_ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   └── FOLDER_STRUCTURE.md
│
├── public/                   # Arquivos estáticos
│   ├── manifest.json
│   └── robots.txt
│
└── src/                      # 🎯 Código-fonte
    │
    ├── config/               # ⚙️ Configurações
    │   └── env.ts            # Variáveis de ambiente tipadas
    │
    ├── domain/               # 🔷 Camada de Domínio (Regras de Negócio)
    │   ├── entities/
    │   │   └── User.ts       # Entidade User + schemas Zod
    │   ├── repositories/
    │   │   └── IAuthRepository.ts  # Interface do repositório
    │   └── services/
    │       └── AuthService.ts      # Lógica de negócio de autenticação
    │
    ├── data/                 # 💾 Camada de Dados (Implementações)
    │   ├── http/
    │   │   └── HttpClient.ts       # Cliente HTTP (axios wrapper)
    │   ├── repositories/
    │   │   └── AuthRepositoryImpl.ts  # Implementação do IAuthRepository
    │   ├── storage/
    │   │   └── TokenStorage.ts     # Gerenciamento de localStorage
    │   └── di/
    │       └── container.ts        # Dependency Injection Container
    │
    ├── contexts/             # 🎨 Camada de Apresentação (Estado)
    │   └── AuthContext.tsx   # Context API + hooks de autenticação
    │
    ├── components/           # 🧩 Componentes React
    │   ├── Header.tsx        # Header/Navigation
    │   └── ui/               # shadcn/ui components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       └── separator.tsx
    │
    ├── routes/               # 🛣️ Rotas (TanStack Router - file-based)
    │   ├── __root.tsx        # Layout raiz + providers
    │   ├── index.tsx         # Landing page (/)
    │   ├── login.tsx         # Página de login (/login)
    │   ├── cadastro.tsx      # Página de cadastro (/cadastro)
    │   └── demo/             # Exemplos de implementação
    │       ├── api.names.ts
    │       ├── api.tq-todos.ts
    │       ├── start.api-request.tsx
    │       ├── start.server-funcs.tsx
    │       ├── start.ssr.data-only.tsx
    │       ├── start.ssr.full-ssr.tsx
    │       ├── start.ssr.index.tsx
    │       ├── start.ssr.spa-mode.tsx
    │       └── tanstack-query.tsx
    │
    ├── integrations/         # 🔌 Integrações com bibliotecas
    │   └── tanstack-query/
    │       ├── devtools.tsx
    │       └── root-provider.tsx
    │
    ├── lib/                  # 🛠️ Utilitários (legacy)
    │   ├── utils.ts          # Helpers (cn, etc.)
    │   └── schemas/          # ⚠️ DEPRECATED - migrado para domain/entities
    │       └── auth.schema.ts
    │
    ├── data/                 # 📊 Server functions (TanStack Start)
    │   └── demo.punk-songs.ts
    │
    ├── router.tsx            # Router configuration
    ├── routeTree.gen.ts      # Auto-generated route tree
    └── styles.css            # Estilos globais (Tailwind)
```

---

## 📂 Descrição Detalhada

### 🔷 `src/domain/` - Camada de Domínio

**Responsabilidade:** Regras de negócio puras, sem dependências externas.

#### `entities/`
Modelos de dados + schemas de validação.

- **`User.ts`**
  - Interface `User` (tipo puro)
  - Interfaces `LoginCredentials`, `RegisterData`, `AuthResponse`
  - Schemas Zod: `loginSchema`, `registerSchema`
  - Types derivados: `LoginFormData`, `RegisterFormData`

**Conceito:** Entidades representam objetos de negócio. Schemas Zod ficam aqui pois validam dados do domínio.

#### `repositories/`
Interfaces (contratos) para acesso a dados.

- **`IAuthRepository.ts`**
  - Interface com métodos: `login()`, `register()`, `logout()`, `validateToken()`
  
**Conceito:** Define **O QUE** fazer, não **COMO** fazer. Implementações ficam na camada de dados.

#### `services/`
Lógica de negócio que orquestra repositories.

- **`AuthService.ts`**
  - Classe que recebe `IAuthRepository` via construtor
  - Adiciona lógica além do CRUD (validações, logs, etc.)
  - Métodos: `login()`, `register()`, `logout()`, `validateToken()`

**Conceito:** Camada que adiciona valor ao negócio. Se não há lógica adicional, considere não criar service.

---

### 💾 `src/data/` - Camada de Dados

**Responsabilidade:** Implementações concretas de acesso a dados.

#### `http/`
Cliente HTTP centralizado.

- **`HttpClient.ts`**
  - Wrapper sobre axios
  - Configuração: baseURL, timeout, headers
  - Interceptors: adiciona token automaticamente, trata erros 401
  - Métodos: `get()`, `post()`, `put()`, `delete()`, `patch()`
  - Gerenciamento de token: `setToken()`, `clearToken()`

**Conceito:** Centraliza configuração HTTP. Todas as chamadas de API passam por aqui.

#### `repositories/`
Implementações das interfaces do domínio.

- **`AuthRepositoryImpl.ts`**
  - Implementa `IAuthRepository`
  - Usa `HttpClient` para chamadas HTTP
  - Usa `TokenStorage` para persistência
  - Métodos fazem requests HTTP e tratam respostas

**Conceito:** Camada de integração com APIs. Transforma DTOs em Entities.

#### `storage/`
Abstrações para armazenamento local.

- **`TokenStorage.ts`**
  - Wrapper sobre localStorage
  - Métodos: `saveToken()`, `getToken()`, `removeToken()`, `saveUser()`, `getUser()`, `clear()`
  - Keys centralizadas: `@tickethub:token`, `@tickethub:user`

**Conceito:** Isola acesso ao localStorage. Facilita trocar implementação (ex: cookies, sessionStorage).

#### `di/`
Dependency Injection Container.

- **`container.ts`**
  - Cria instâncias de HttpClient, TokenStorage
  - Instancia AuthRepositoryImpl com dependências
  - Instancia AuthService com repository
  - Exporta `authService` (singleton)

**Conceito:** Padrão Singleton + Inversão de Controle. Componentes recebem dependências prontas.

---

### 🎨 `src/contexts/` - Camada de Apresentação

**Responsabilidade:** Gerenciamento de estado global da UI.

- **`AuthContext.tsx`**
  - `AuthProvider` component
  - Recebe `authService` via props (injeção de dependência)
  - Estado: `user`, `isLoading`, `isAuthenticated`
  - Métodos: `login()`, `register()`, `logout()`
  - Hooks: `useAuth()`, `useRequireAuth()`
  - Validação de sessão no `useEffect` inicial

**Conceito:** Gerencia apenas estado de UI. Delega lógica de negócio para services.

---

### 🧩 `src/components/`

**Responsabilidade:** Componentes reutilizáveis de UI.

#### `Header.tsx`
Menu de navegação lateral com links.

#### `ui/`
Componentes do shadcn/ui:
- `button.tsx` - Botões
- `card.tsx` - Cards
- `form.tsx` - Formulários
- `input.tsx` - Inputs
- `label.tsx` - Labels
- `separator.tsx` - Separadores

**Conceito:** Design system baseado em Radix UI + Tailwind CSS.

---

### 🛣️ `src/routes/`

**Responsabilidade:** File-based routing (TanStack Router).

#### Rotas Principais

- **`__root.tsx`**
  - Layout raiz
  - Providers: `AuthProvider`, `TanStackDevtools`
  - Componente: `<Header />` + `{children}`

- **`index.tsx`**
  - Landing page (`/`)
  - Hero, features, CTA, footer

- **`login.tsx`**
  - Formulário de login (`/login`)
  - Usa `useAuth()` hook
  - React Hook Form + Zod validation

- **`cadastro.tsx`**
  - Formulário de registro (`/cadastro`)
  - Usa `useAuth()` hook
  - Validação de senha forte

#### `demo/`
Exemplos de implementação (mantidos para referência):
- `tanstack-query.tsx` - CRUD com TanStack Query
- `start.api-request.tsx` - Fetch + TQ
- `start.server-funcs.tsx` - Server functions
- `start.ssr.*` - Exemplos SSR/SPA

---

### ⚙️ `src/config/`

**Responsabilidade:** Configurações centralizadas.

- **`env.ts`**
  - Valida variáveis de ambiente
  - Exporta objeto `env` tipado
  - Lança erro se variável obrigatória estiver faltando
  - Interface `EnvConfig` com tipos

**Conceito:** Type-safe access a `import.meta.env`.

---

### 🛠️ `src/lib/`

**Responsabilidade:** Utilitários e helpers.

- **`utils.ts`**
  - Função `cn()` - concatena classes Tailwind
  - Baseado em `clsx` + `tailwind-merge`

- **`schemas/`** ⚠️ **DEPRECATED**
  - `auth.schema.ts` - Migrado para `domain/entities/User.ts`
  - Manter por compatibilidade temporária

---

### 🔌 `src/integrations/`

**Responsabilidade:** Integrações com bibliotecas externas.

- **`tanstack-query/`**
  - `root-provider.tsx` - Setup do QueryClient
  - `devtools.tsx` - Plugin do devtools

---

### 📊 `src/data/` (TanStack Start)

**Responsabilidade:** Server functions.

- **`demo.punk-songs.ts`**
  - Exemplo de server function
  - Acessa filesystem (Node.js)

---

### 🎨 `public/`

Arquivos estáticos servidos na raiz.

- `manifest.json` - PWA manifest
- `robots.txt` - SEO

---

## 🔄 Fluxo de Arquivos

### Login Flow

```
1. routes/login.tsx
   ↓ importa
2. contexts/AuthContext.tsx
   ↓ usa
3. data/di/container.ts (authService)
   ↓ instancia
4. domain/services/AuthService.ts
   ↓ usa
5. domain/repositories/IAuthRepository.ts (interface)
   ↓ implementado por
6. data/repositories/AuthRepositoryImpl.ts
   ↓ usa
7. data/http/HttpClient.ts
   ↓ usa
8. config/env.ts (baseURL)
```

---

## 📋 Checklist de Manutenção

### Adicionar Nova Entity

- [ ] Criar `src/domain/entities/NomeEntity.ts`
- [ ] Definir interface + schemas Zod
- [ ] Exportar types

### Adicionar Novo Repositório

- [ ] Criar interface `src/domain/repositories/INomeRepository.ts`
- [ ] Implementar `src/data/repositories/NomeRepositoryImpl.ts`
- [ ] Registrar em `src/data/di/container.ts`

### Adicionar Novo Service

- [ ] Criar `src/domain/services/NomeService.ts`
- [ ] Injetar repository via construtor
- [ ] Adicionar lógica de negócio
- [ ] Exportar em `container.ts`

### Adicionar Nova Rota

- [ ] Criar `src/routes/nome-rota.tsx`
- [ ] Usar `createFileRoute()`
- [ ] Importar de `@/domain/entities` (schemas)
- [ ] Usar hooks de contexts

### Adicionar Novo Context

- [ ] Criar `src/contexts/NomeContext.tsx`
- [ ] Receber service via props
- [ ] Criar hook customizado (`useNome`)
- [ ] Adicionar provider em `__root.tsx`

---

## 🎯 Boas Práticas de Organização

### ✅ Faça

- Mantenha entities com tipos + schemas
- Use interfaces para repositories
- Injete dependências via construtor
- Centralize configurações em `config/`
- Use path alias `@/` para imports

### ❌ Evite

- Lógica de negócio em componentes
- Chamadas HTTP diretas fora de repositories
- `localStorage` direto (use `TokenStorage`)
- Hardcoded URLs/keys (use `env.ts`)
- Importar de camadas superiores (respeite a hierarquia)

---

## 📊 Hierarquia de Dependências

```
┌──────────────────────────────┐
│   UI Layer (Routes/Components)│
└───────────┬──────────────────┘
            ↓ usa
┌──────────────────────────────┐
│   Contexts (AuthContext)     │
└───────────┬──────────────────┘
            ↓ usa
┌──────────────────────────────┐
│   Services (AuthService)     │
└───────────┬──────────────────┘
            ↓ usa
┌──────────────────────────────┐
│   Repositories (Interface)   │
└───────────┬──────────────────┘
            ↑ implementado por
┌──────────────────────────────┐
│   Data Layer (Impl)          │
└───────────┬──────────────────┘
            ↓ usa
┌──────────────────────────────┐
│   Infrastructure (HTTP, Storage)│
└──────────────────────────────┘
```

**Regra:** Dependências apontam sempre para baixo (ou para contratos).

---

**Última atualização:** Fevereiro 2026
