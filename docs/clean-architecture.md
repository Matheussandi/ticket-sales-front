# Clean Architecture

## Camadas

### Domain (Regras de Negócio)
**Pasta:** `src/domain/`

- **entities/** - Schemas Zod + tipos derivados (`type X = z.infer<typeof schema>`)
- **repositories/** - Interfaces/contratos (prefixo `I`)
- **services/** - Lógica de negócio, recebe repository via construtor

### Data (Implementações)
**Pasta:** `src/data/`

- **http/HttpClient.ts** - Wrapper Axios com interceptors JWT
- **repositories/** - Implementações concretas (sufixo `Impl`)
- **storage/TokenStorage.ts** - Wrapper localStorage
- **di/container.ts** - Singleton DI: cria httpClient → repositories → services

### Presentation (UI)

- **contexts/** - Estado global (Context API), recebe service via props
- **routes/** - File-based routing (TanStack Router)
- **components/** - Componentes React + shadcn/ui
- **hooks/queries/** - Hooks useQuery (TanStack Query)
- **hooks/mutations/** - Hooks useMutation (TanStack Query)

## Fluxo de Dependências

```
UI (routes, components)
    ↓ usa
Contexts / Hooks
    ↓ usa
Services (domain/services)
    ↓ usa
Repositories (domain/repositories - interface)
    ↑ implementado por
Data Repositories (data/repositories)
    ↓ usa
Infrastructure (HttpClient, TokenStorage)
```

Dependências apontam sempre para dentro (domínio). Camadas externas dependem de interfaces, não de implementações.

## Boas Práticas

- Services dependem de interfaces (`IEventRepository`), nunca de implementações (`EventRepositoryImpl`)
- Chamadas HTTP somente dentro de repositories
- localStorage somente via `TokenStorage`
- Schemas Zod ficam em `domain/entities/`, nunca em componentes
- Path alias `@/` para todos os imports
- Novas dependências devem ser registradas em `data/di/container.ts`
- Services devem conter lógica de negócio real, não apenas repassar chamadas do repository
- Erros devem ser tratados em cada camada com contexto apropriado

## Checklist de Nova Feature

1. Criar entity em `domain/entities/` (schema Zod + type derivado)
2. Criar interface em `domain/repositories/I{Name}Repository.ts`
3. Criar service em `domain/services/{Name}Service.ts`
4. Implementar repository em `data/repositories/{Name}RepositoryImpl.ts`
5. Registrar no `data/di/container.ts`
6. Criar hooks em `hooks/queries/` e `hooks/mutations/`
7. Criar context em `contexts/` (se precisar estado global)
8. Adicionar provider em `__root.tsx` (se criou context)
9. Usar no componente/rota via hook
