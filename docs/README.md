# TicketHub - Documentação

Documentação completa da arquitetura Clean Architecture do TicketHub.

## 📚 Índice de Documentos

### 1. [Quick Start](./QUICK_START.md)
Guia rápido para começar a desenvolver.
- Setup inicial
- Comandos úteis
- Exemplos práticos
- Problemas comuns

### 2. [Clean Architecture](./CLEAN_ARCHITECTURE.md)
Documentação completa da arquitetura.
- Visão geral dos princípios
- Estrutura de camadas (Domain, Data, Presentation, Infrastructure)
- Fluxo de dados
- Guia de implementação
- Boas práticas
- Exemplos de uso

### 3. [API Integration](./API_INTEGRATION.md)
Guia de integração com backend.
- Endpoints esperados
- Formato de requests/responses
- Autenticação JWT
- Mock server para desenvolvimento
- Tratamento de erros
- Debugging

### 4. [Folder Structure](./FOLDER_STRUCTURE.md)
Estrutura completa de pastas e arquivos.
- Árvore de diretórios
- Descrição de cada pasta
- Fluxo de arquivos
- Hierarquia de dependências
- Checklist de manutenção

---

## 🎯 Por onde começar?

### Novo no projeto?
👉 Comece pelo [Quick Start](./QUICK_START.md)

### Quer entender a arquitetura?
👉 Leia [Clean Architecture](./CLEAN_ARCHITECTURE.md)

### Vai integrar com API?
👉 Veja [API Integration](./API_INTEGRATION.md)

### Procurando onde fica um arquivo?
👉 Consulte [Folder Structure](./FOLDER_STRUCTURE.md)

---

## 🏗️ Arquitetura Resumida

```
┌─────────────────────────────────────┐
│         UI / Routes                 │  ← Páginas e componentes
├─────────────────────────────────────┤
│         Contexts (State)            │  ← Estado global (Context API)
├─────────────────────────────────────┤
│    Domain Services (Business)       │  ← Lógica de negócio
├─────────────────────────────────────┤
│   Domain Repositories (Contracts)   │  ← Interfaces
├─────────────────────────────────────┤
│   Data Repositories (Implementation)│  ← Implementações
├─────────────────────────────────────┤
│  Infrastructure (HTTP, Storage)     │  ← Axios, localStorage
└─────────────────────────────────────┘
```

**Regra de Ouro:** Dependências apontam sempre para baixo (ou para contratos).

---

## 🔑 Conceitos-Chave

### Entities
Modelos de dados + validação (Zod schemas).

**Exemplo:** `User`, `Event`, `Ticket`

### Repositories
Contratos (interfaces) para acesso a dados.

**Exemplo:** `IAuthRepository`

### Services
Lógica de negócio que orquestra repositories.

**Exemplo:** `AuthService`

### Contexts
Gerenciamento de estado global (React Context API).

**Exemplo:** `AuthContext`

### Dependency Injection
Container que cria e injeta dependências.

**Exemplo:** `container.ts` → `authService`

---

## 📦 Estrutura de Pastas

```
src/
├── domain/          # Regras de negócio puras
│   ├── entities/
│   ├── repositories/
│   └── services/
├── data/            # Implementações de acesso a dados
│   ├── http/
│   ├── repositories/
│   ├── storage/
│   └── di/
├── contexts/        # Estado global (Context API)
├── routes/          # Páginas (TanStack Router)
├── components/      # Componentes UI
└── config/          # Configurações (env vars)
```

---

## 🚀 Comandos Essenciais

```bash
# Desenvolvimento
pnpm dev              # Rodar servidor dev (porta 3000)

# Build
pnpm build            # Build para produção

# Code Quality
pnpm lint             # Rodar linter
pnpm format           # Formatar código
pnpm check            # Lint + Format

# Componentes
pnpm dlx shadcn@latest add <component>
```

---

## 🔄 Fluxo Típico

### Login de Usuário

```
User Input (login.tsx)
    ↓
useAuth() hook (AuthContext)
    ↓
authService.login() (AuthService)
    ↓
authRepository.login() (IAuthRepository)
    ↓
httpClient.post() (HttpClient)
    ↓
API Request
```

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React 19 + TanStack Start |
| Routing | TanStack Router (file-based) |
| State | Context API + TanStack Query |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Language | TypeScript 5.7 |
| Linter/Formatter | Biome.js |

---

## 📋 Checklist de Nova Feature

- [ ] 1. Criar entity em `domain/entities/`
- [ ] 2. Criar interface em `domain/repositories/`
- [ ] 3. Criar service em `domain/services/`
- [ ] 4. Implementar repository em `data/repositories/`
- [ ] 5. Registrar no `data/di/container.ts`
- [ ] 6. Criar context em `contexts/` (opcional)
- [ ] 7. Criar rota em `routes/`
- [ ] 8. Testar integração

---

## 🎓 Recursos Adicionais

### Documentação Externa

- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Clean Architecture

- [Uncle Bob - Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

## 🤝 Contribuindo

1. Leia toda a documentação
2. Siga os padrões estabelecidos
3. Adicione testes (quando disponível)
4. Atualize documentação se necessário
5. Faça PR com descrição clara

---

## 📞 Suporte

Para dúvidas:
1. Consulte esta documentação
2. Veja exemplos no código existente
3. Pergunte à equipe

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0.0
