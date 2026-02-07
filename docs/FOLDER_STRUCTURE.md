# Estrutura de Pastas

```
src/
├── domain/                    # Regras de negócio
│   ├── entities/              # User.ts (types + Zod schemas)
│   ├── repositories/          # IAuthRepository.ts (interfaces)
│   └── services/              # AuthService.ts (lógica de negócio)
│
├── data/                      # Implementações
│   ├── http/                  # HttpClient.ts (axios wrapper)
│   ├── repositories/          # AuthRepositoryImpl.ts
│   ├── storage/               # TokenStorage.ts (localStorage)
│   └── di/                    # container.ts (dependency injection)
│
├── contexts/                  # AuthContext.tsx (estado global)
│
├── routes/                    # TanStack Router (file-based)
│   ├── __root.tsx             # Layout + providers
│   ├── index.tsx              # Landing page (/)
│   ├── login.tsx              # Login (/login)
│   └── cadastro.tsx           # Cadastro (/cadastro)
│
├── components/                # Componentes UI
│   ├── Header.tsx
│   └── ui/                    # shadcn/ui (button, card, form, input...)
│
├── config/                    # env.ts (variáveis de ambiente)
│
└── lib/                       # utils.ts (helpers)
```

## Descrição Rápida

- **domain/entities/**: Modelos + validação Zod
- **domain/repositories/**: Interfaces (contratos)
- **domain/services/**: Lógica de negócio
- **data/http/**: Cliente axios com interceptors
- **data/repositories/**: Implementações das interfaces
- **data/storage/**: Wrapper localStorage
- **data/di/**: Cria e injeta dependências
- **contexts/**: Estado global (Context API)
- **routes/**: Páginas (file-based routing)
- **components/ui/**: Componentes shadcn/ui
- **config/**: Variáveis de ambiente tipadas

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
