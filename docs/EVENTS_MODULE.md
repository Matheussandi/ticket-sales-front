# Sistema de Eventos - Documentação

## Visão Geral

Módulo completo de gerenciamento de eventos seguindo Clean Architecture, com dashboard, listagem filtrada, criação de eventos e proteção de rotas.

## Estrutura do Módulo

### Domain Layer (Regras de Negócio)

#### Event Entity (`src/domain/entities/Event.ts`)
```typescript
// Schemas Zod para validação
- eventSchema: Validação da entidade Event da API
- createEventSchema: Validação do payload de criação
- eventListSchema: Validação de lista de eventos
- eventFiltersSchema: Validação de filtros de busca

// Types derivados
- Event: Entidade principal
- CreateEventPayload: Dados para criar evento
- CreateEventFormData: Dados do formulário
- EventFilters: Filtros de busca (name, date, location)
```

#### IEventRepository (`src/domain/repositories/IEventRepository.ts`)
```typescript
interface IEventRepository {
  listEvents(filters?: EventFilters): Promise<Event[]>
  createEvent(data: CreateEventPayload): Promise<Event>
}
```

#### EventService (`src/domain/services/EventService.ts`)
```typescript
class EventService {
  getAllEvents(): Promise<Event[]>        // Lista todos, ordenado por created_at
  searchEvents(filters): Promise<Event[]> // Lista com filtros, ordenado por date
  createEvent(data): Promise<Event>       // Cria evento com validação adicional
}
```

### Data Layer (Implementação)

#### EventRepositoryImpl (`src/data/repositories/EventRepositoryImpl.ts`)
- Implementa `IEventRepository`
- Usa `HttpClient` para chamadas HTTP
- **Endpoints:**
  - `GET /events?name=X&date=Y&location=Z` - Listagem com filtros
  - `POST /events` - Criação de evento
- Valida responses com schemas Zod

#### Dependency Injection (`src/data/di/container.ts`)
```typescript
const eventRepository = new EventRepositoryImpl(httpClient)
export const eventService = new EventService(eventRepository)
```

### Presentation Layer (UI)

#### Hooks Customizados

##### `useEvents` (`src/hooks/useEvents.ts`)
```typescript
// TanStack Query hooks
useEventList(filters?: EventFilters) // Query para listagem
useCreateEvent()                      // Mutation para criação
```

Benefícios:
- ✅ Cache automático de eventos
- ✅ Loading/error states
- ✅ Cache invalidation ao criar evento
- ✅ Optimistic updates possíveis

##### `useDebounce` (`src/hooks/useDebounce.ts`)
```typescript
function useDebounce<T>(value: T, delay = 500): T
```

**Uso:**
- Otimiza filtros de busca evitando múltiplas chamadas à API
- Delay padrão: 500ms
- Usado em filtros de nome e localização

**Exemplo:**
```typescript
const [nameInput, setNameInput] = useState("")
const debouncedName = useDebounce(nameInput, 500)
// API só é chamada 500ms após usuário parar de digitar
```

#### Componentes

##### `CreateEventDialog` (`src/components/events/CreateEventDialog.tsx`)

**UX Improvements:**
- ✅ Asteriscos vermelhos para campos obrigatórios (`<span className="text-destructive">*</span>`)
- ✅ IDs únicos com `useId()` para acessibilidade
- ✅ Validação em tempo real com React Hook Form + Zod
- ✅ Feedback visual de erros
- ✅ Loading state no botão de submit
- ✅ Reset automático ao fechar ou após sucesso

**Campos:**
- Nome do Evento * (min 3 caracteres)
- Descrição * (min 10 caracteres, textarea)
- Data e Hora * (datetime-local, deve ser futura)
- Localização * (min 3 caracteres)

**Validações:**
- Client-side: Zod schema
- Server-side: EventService valida data futura
- Toast notifications: Sucesso/erro

##### `EventsPage` (`src/routes/_authenticated/events/index.tsx`)

**Features:**
- 📊 Listagem completa de eventos em tabela
- 🔍 **Filtros com debounce:**
  - Nome (debounced 500ms)
  - Data (sem debounce)
  - Localização (debounced 500ms)
- ➕ Botão criar evento (abre dialog)
- 🏷️ Badge de status: "Próximo" ou "Realizado"
- 💀 Skeleton loading
- 🚫 Empty states inteligentes
- 🧹 Botão limpar filtros

**Debounce Implementation:**
```typescript
// Estados locais para inputs (atualizam imediatamente)
const [nameInput, setNameInput] = useState("")
const [locationInput, setLocationInput] = useState("")

// Valores debounced (atualizam após 500ms)
const debouncedName = useDebounce(nameInput, 500)
const debouncedLocation = useDebounce(locationInput, 500)

// Filtros aplicados com valores debounced
useEffect(() => {
  setFilters({
    name: debouncedName || undefined,
    location: debouncedLocation || undefined,
    date: dateFilter || undefined,
  })
}, [debouncedName, debouncedLocation, dateFilter])
```

**Benefícios:**
- ✅ UX responsiva: input atualiza instantaneamente
- ✅ Performance: API chamada apenas após 500ms de inatividade
- ✅ Reduz carga no servidor
- ✅ Economiza requests

**Tabela de Eventos:**
| Coluna | Descrição |
|--------|-----------|
| Nome | Nome do evento |
| Descrição | Truncada com `max-w-xs truncate` |
| Data | Formato pt-BR com hora |
| Localização | Local do evento |
| Status | Badge colorido (Próximo/Realizado) |
| Criado em | Data de criação |

##### `Dashboard` (`src/routes/_authenticated/dashboard.tsx`)

**Cards de Estatísticas:**
1. **Total Eventos** - Total de eventos cadastrados
2. **Este Mês** - Eventos programados para o mês atual
3. **Tickets Vendidos** - Total de ingressos (mockado: 1250)
4. **Receita** - Valor arrecadado (mockado: R$ 45.780)

**Tabela Recentes:**
- Últimos 5 eventos criados
- Mesmas colunas da página de eventos
- Link implícito para página completa

### Rotas Protegidas

#### Layout Autenticado (`src/routes/_authenticated.tsx`)

**Features:**
- ✅ Route guard com `beforeLoad`
- ✅ Verifica token no localStorage
- ✅ Redirect para `/login` se não autenticado
- ✅ Sidebar fixa para todas rotas autenticadas
- ✅ Usa `SidebarProvider` do shadcn/ui

**Estrutura:**
```typescript
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const token = localStorage.getItem("@tickethub:token")
    if (!token) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
  },
  component: AuthenticatedLayout,
})
```

**Rotas Filhas:**
- `/dashboard` → Dashboard com estatísticas
- `/events` → Listagem e gerenciamento de eventos
- `/profile` → Perfil do usuário (preparado)

#### Sidebar (`src/components/AppSidebar.tsx`)

**Navegação:**
- 🏠 Dashboard
- 📅 Eventos
- 👤 Perfil
- 🚪 Sair (com logout)

**Features:**
- ✅ Item ativo destacado com `useMatchRoute()`
- ✅ Responsivo (collapsible em mobile)
- ✅ Info do usuário no footer
- ✅ Botão logout com toast

## Fluxo de Dados

### Listagem de Eventos
```
EventsPage (UI)
  ↓ useState (nameInput, locationInput, dateFilter)
  ↓ useDebounce (500ms para nome e localização)
  ↓ useEffect (atualiza filters)
  ↓ useEventList(filters) [TanStack Query]
  ↓ eventService.searchEvents(filters)
  ↓ eventRepository.listEvents(filters)
  ↓ httpClient.get("/events?name=X&location=Y")
  ↓ API Backend
  ↓ Validação com eventListSchema
  ↓ Cache no TanStack Query
  ↓ Renderiza tabela
```

### Criação de Evento
```
CreateEventDialog (UI)
  ↓ useForm + Zod validation (client-side)
  ↓ handleSubmit
  ↓ useCreateEvent().mutateAsync(data) [TanStack Query]
  ↓ eventService.createEvent(data)
  ↓ Validação: data futura (server-side)
  ↓ eventRepository.createEvent(data)
  ↓ httpClient.post("/events", data)
  ↓ API Backend
  ↓ Validação com eventSchema
  ↓ Invalidação do cache (queryClient.invalidateQueries)
  ↓ Toast de sucesso
  ↓ Fecha dialog
  ↓ Tabela atualiza automaticamente
```

## Patterns e Best Practices

### 1. Debounce Pattern
```typescript
// ✅ Correto: Estado local + debounce + filtros
const [input, setInput] = useState("")
const debouncedValue = useDebounce(input, 500)

useEffect(() => {
  setFilters({ name: debouncedValue })
}, [debouncedValue])

// ❌ Errado: Aplicar filtro diretamente
onChange={(e) => setFilters({ name: e.target.value })} // Muitas chamadas!
```

### 2. UX para Campos Obrigatórios
```tsx
// ✅ Correto: Asterisco vermelho visualmente destacado
<Label>
  Nome do Evento <span className="text-destructive">*</span>
</Label>

// ❌ Evitar: Asterisco preto (pouca visibilidade)
<Label>Nome do Evento *</Label>
```

### 3. Acessibilidade com useId()
```tsx
// ✅ Correto: IDs únicos
const id = useId()
<Label htmlFor={id}>Nome</Label>
<Input id={id} />

// ❌ Evitar: IDs estáticos (conflitos em múltiplas instâncias)
<Label htmlFor="name">Nome</Label>
<Input id="name" />
```

### 4. Loading States
```tsx
// ✅ Skeleton para listas
{isLoading && [...Array(5)].map((_, i) => <Skeleton key={i} />)}

// ✅ Botão com loading state
<Button disabled={isSubmitting}>
  {isSubmitting ? "Salvando..." : "Salvar"}
</Button>
```

### 5. Empty States
```tsx
// ✅ Mensagem contextual
{events.length === 0 && (
  hasActiveFilters 
    ? "Tente ajustar os filtros"
    : "Comece criando seu primeiro evento"
)}
```

## Próximos Passos

### Features Planejadas
- [ ] Edição de eventos
- [ ] Exclusão de eventos
- [ ] Detalhes do evento
- [ ] Sistema de tickets/ingressos
- [ ] Integração com pagamentos
- [ ] Relatórios e analytics
- [ ] Exportação de dados
- [ ] Filtros avançados (categoria, preço, etc)
- [ ] Ordenação customizável
- [ ] Paginação

### Melhorias Técnicas
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração (Playwright)
- [ ] Storybook para componentes
- [ ] Error boundaries
- [ ] Retry logic para falhas de API
- [ ] Optimistic updates
- [ ] Infinite scroll na lista
- [ ] Virtual scrolling para grandes listas

## Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Lint e format
pnpm check

# Adicionar novo componente shadcn/ui
pnpm dlx shadcn@latest add <component>
```

## Troubleshooting

### Filtros não funcionam
- Verifique se `useDebounce` está importado
- Confirme delay (500ms padrão)
- Check console para erros de API

### Dialog não fecha após criar evento
- Verify `reset()` é chamado
- Check `onOpenChange(false)` está sendo executado
- Verifique se não há erros no console

### Sidebar não marca rota ativa
- Confirme `useMatchRoute()` está correto
- Verifique estrutura de rotas (`/_authenticated/...`)
- Check se `to` prop do Link está correto

---

**Última atualização:** 17 de fevereiro de 2026  
**Versão do Módulo:** 1.0.0
