# Clean Architecture

## Camadas

### Domain (Regras de Negócio)
**Pasta:** `src/domain/`

- **entities/** - Schemas Zod + tipos derivados
  - `User.ts`: 
    - Schemas: userSchema, loginRequestSchema, registerRequestSchema, authResponseSchema
    - Types derivados: User, LoginRequest, RegisterRequest, AuthResponse
    - Padrão: schema primeiro, depois `type X = z.infer<typeof schema>`
- **repositories/** - Interfaces (contratos)
  - `IAuthRepository.ts`: interface com métodos login(), register(), logout()
- **services/** - Lógica de negócio
  - `AuthService.ts`: recebe IAuthRepository via construtor, orquestra lógica

### Data (Implementações)
**Pasta:** `src/data/`

- **http/** - Cliente HTTP
  - `HttpClient.ts`: wrapper axios, interceptors (adiciona token), métodos get/post/put/delete
- **repositories/** - Implementação das interfaces
  - `AuthRepositoryImpl.ts`: implementa IAuthRepository, usa HttpClient e TokenStorage
- **storage/** - Persistência local
  - `TokenStorage.ts`: wrapper localStorage, métodos saveToken/getToken/removeToken
- **di/** - Dependency Injection
  - `container.ts`: cria instâncias (httpClient → authRepository → authService)

### Contexts (Estado Global)
**Pasta:** `src/contexts/`

- `AuthContext.tsx`: Provider + hooks (useAuth, useRequireAuth), recebe authService via props

## Fluxo

```
login.tsx → useAuth() → authService.login() → authRepository.login() → httpClient.post() → API
```

## Regra

Dependências apontam sempre para dentro (Domain). Camadas externas dependem de interfaces, não de implementações.

## Adicionar Feature

1. Criar entity em `domain/entities/`
2. Criar interface em `domain/repositories/`
3. Criar service em `domain/services/`
4. Implementar em `data/repositories/`
5. Registrar em `data/di/container.ts`
6. Criar context se necessário
7. Usar nos componentes/rotas
  }
}
```

**Conceitos:**
- Wrapper sobre axios para centralizar configurações
- Interceptors gerenciam autenticação automaticamente
- Métodos tipados (get, post, put, delete, patch)

---

#### 📂 `data/repositories/`

Implementações concretas das interfaces do domínio.

**Exemplo: `AuthRepositoryImpl.ts`**

```typescript
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private httpClient: HttpClient,
    private tokenStorage: TokenStorage
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Persiste token e usuário
    this.tokenStorage.saveToken(response.token);
    this.tokenStorage.saveUser(response.user);

    return response;
  }
}
```

**Conceitos:**
- Implementa interface `IAuthRepository`
- Usa `HttpClient` para chamadas HTTP
- Gerencia persistência de dados (tokens, cache)

---

#### 📂 `data/storage/`

Abstração para armazenamento local (localStorage, cookies, etc.).

**Exemplo: `TokenStorage.ts`**

```typescript
export class TokenStorage {
  private readonly TOKEN_KEY = "@tickethub:token";

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
```

**Conceitos:**
- Encapsula acesso ao localStorage
- Facilita trocar implementação (ex: sessionStorage, cookies)
- Keys centralizadas (evita typos)

---

#### 📂 `data/di/`

Dependency Injection Container - cria e configura dependências.

**Exemplo: `container.ts`**

```typescript
// Infrastructure
const httpClient = new HttpClient();
const tokenStorage = new TokenStorage();

// Data Layer
const authRepository = new AuthRepositoryImpl(httpClient, tokenStorage);

// Domain Layer
export const authService = new AuthService(authRepository);
```

**Conceitos:**
- Padrão Singleton - instâncias únicas
- Inversão de controle - componentes recebem dependências prontas
- Facilita testes - fácil mockar dependências

---

### 3️⃣ Presentation Layer (Camada de Apresentação)

#### 📂 `contexts/`

Gerenciamento de estado global usando Context API.

**Exemplo: `AuthContext.tsx`**

```typescript
export function AuthProvider({ children, authService }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
```

**Conceitos:**
- Recebe `authService` via props (injeção de dependência)
- Gerencia apenas estado de UI (loading, user, errors)
- Delega lógica de negócio para services
- Hooks customizados simplificam uso

---

### 4️⃣ Infrastructure Layer (Infraestrutura)

#### 📂 `config/`

Configurações e variáveis de ambiente tipadas.

**Exemplo: `env.ts`**

```typescript
interface EnvConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  isDevelopment: boolean;
}

function validateEnvVars(): EnvConfig {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("Missing VITE_API_BASE_URL");
  }

  return {
    apiBaseUrl,
    apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT ?? 30000),
    isDevelopment: import.meta.env.MODE === "development",
  };
}

export const env = validateEnvVars();
```

**Conceitos:**
- Valida env vars na inicialização
- Type-safe - autocomplete nas IDEs
- Centraliza acesso a `import.meta.env`

---

## 🔄 Fluxo de Dados

### Exemplo: Login de Usuário

```
1. [UI] Componente Login
   ↓ handleSubmit(data)
   
2. [Hook] useAuth()
   ↓ login(credentials)
   
3. [Context] AuthContext
   ↓ authService.login(credentials)
   
4. [Service] AuthService
   ↓ authRepository.login(credentials)
   
5. [Repository] AuthRepositoryImpl
   ↓ httpClient.post("/auth/login", credentials)
   
6. [HTTP Client] HttpClient
   ↓ axios.post (com interceptors)
   
7. [API] Backend
   ↓ response { user, token }
   
8. [Repository] Salva token
   ↓ tokenStorage.saveToken(token)
   
9. [Service] Retorna AuthResponse
   
10. [Context] Atualiza estado
    ↓ setUser(response.user)
    
11. [UI] Re-renderiza com usuário autenticado
```

### Fluxo Inverso (Dependências)

```
UI/Components
    ↓ depende de
Contexts (AuthContext)
    ↓ depende de
Domain Services (AuthService)
    ↓ depende de
Domain Repositories (IAuthRepository - interface)
    ↑ implementado por
Data Repositories (AuthRepositoryImpl)
    ↓ depende de
Infrastructure (HttpClient, TokenStorage)
```

**Regra de Ouro:** Dependências apontam sempre **para dentro** (para o domínio).

---

## 🛠️ Guia de Implementação

### Como Adicionar Nova Feature (ex: Events)

#### 1. Criar Entidade

```typescript
// src/domain/entities/Event.ts
export interface Event {
  id: string;
  title: string;
  date: Date;
  price: number;
}

export const createEventSchema = z.object({
  title: z.string().min(3),
  date: z.coerce.date(),
  price: z.number().positive()
});
```

#### 2. Criar Interface do Repositório

```typescript
// src/domain/repositories/IEventRepository.ts
export interface IEventRepository {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event>;
  create(data: CreateEventData): Promise<Event>;
}
```

#### 3. Criar Service

```typescript
// src/domain/services/EventService.ts
export class EventService {
  constructor(private eventRepository: IEventRepository) {}

  async getAllEvents(): Promise<Event[]> {
    return await this.eventRepository.getAll();
  }
}
```

#### 4. Implementar Repositório

```typescript
// src/data/repositories/EventRepositoryImpl.ts
export class EventRepositoryImpl implements IEventRepository {
  constructor(private httpClient: HttpClient) {}

  async getAll(): Promise<Event[]> {
    return await this.httpClient.get<Event[]>("/events");
  }
}
```

#### 5. Registrar no Container

```typescript
// src/data/di/container.ts
const eventRepository = new EventRepositoryImpl(httpClient);
export const eventService = new EventService(eventRepository);
```

#### 6. Criar Context (se necessário)

```typescript
// src/contexts/EventContext.tsx
export function EventProvider({ children, eventService }) {
  const [events, setEvents] = useState<Event[]>([]);

  const loadEvents = async () => {
    const data = await eventService.getAllEvents();
    setEvents(data);
  };

  return <EventContext.Provider value={{ events, loadEvents }}>
    {children}
  </EventContext.Provider>;
}
```

#### 7. Usar no Componente

```typescript
// src/routes/events.tsx
function EventsPage() {
  const { events, loadEvents } = useEvents();

  useEffect(() => {
    loadEvents();
  }, []);

  return <div>{events.map(event => ...)}</div>;
}
```

---

## 🔐 Variáveis de Ambiente

### Arquivos

- **`.env.development`** - Desenvolvimento local
- **`.env.production`** - Produção
- **`.env.example`** - Template (commitado no git)

### Variáveis Disponíveis

```bash
# URL base da API
VITE_API_BASE_URL=http://localhost:3001

# Timeout de requisições (ms)
VITE_API_TIMEOUT=30000
```

### Como Usar

```typescript
import { env } from '@/config/env';

console.log(env.apiBaseUrl);      // Type-safe
console.log(env.isDevelopment);   // true/false
```

### Adicionar Nova Variável

1. Adicione em `.env.development` e `.env.production`
2. Atualize interface `EnvConfig` em `config/env.ts`
3. Valide em `validateEnvVars()`

```typescript
// config/env.ts
interface EnvConfig {
  apiBaseUrl: string;
  apiTimeout: number;
  newVariable: string; // ← Nova variável
}

function validateEnvVars(): EnvConfig {
  return {
    apiBaseUrl: getEnvVar("VITE_API_BASE_URL"),
    apiTimeout: Number(getEnvVar("VITE_API_TIMEOUT", "30000")),
    newVariable: getEnvVar("VITE_NEW_VARIABLE"), // ← Validação
  };
}
```

---

## ✅ Boas Práticas

### 1. Sempre use Interfaces

❌ **Ruim:**
```typescript
class EventService {
  constructor(private eventRepo: EventRepositoryImpl) {}
}
```

✅ **Bom:**
```typescript
class EventService {
  constructor(private eventRepo: IEventRepository) {}
}
```

### 2. Não acesse localStorage diretamente

❌ **Ruim:**
```typescript
const token = localStorage.getItem("token");
```

✅ **Bom:**
```typescript
const token = tokenStorage.getToken();
```

### 3. Não faça chamadas HTTP fora dos Repositories

❌ **Ruim:**
```typescript
function EventsPage() {
  const fetchEvents = async () => {
    const res = await fetch("/events");
    const data = await res.json();
    setEvents(data);
  };
}
```

✅ **Bom:**
```typescript
function EventsPage() {
  const { events, loadEvents } = useEvents(); // Context → Service → Repository
  
  useEffect(() => {
    loadEvents();
  }, []);
}
```

### 4. Services devem adicionar lógica de negócio

❌ **Ruim (só repassa):**
```typescript
class EventService {
  async getAll() {
    return await this.repo.getAll(); // Sem valor agregado
  }
}
```

✅ **Bom:**
```typescript
class EventService {
  async getUpcomingEvents() {
    const all = await this.repo.getAll();
    const now = new Date();
    
    // Lógica de negócio: filtrar eventos futuros
    return all
      .filter(event => event.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
```

### 5. Trate erros apropriadamente

✅ **Bom:**
```typescript
// Repository
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    return await this.httpClient.post("/auth/login", credentials);
  } catch (error) {
    // Deixa o erro propagar ou transforma
    throw error;
  }
}

// Service
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    return await this.authRepository.login(credentials);
  } catch (error) {
    // Adiciona contexto de negócio
    if (error.response?.status === 401) {
      throw new Error("Email ou senha inválidos");
    }
    throw new Error("Erro ao fazer login");
  }
}

// Context
const login = async (credentials: LoginCredentials) => {
  try {
    const response = await authService.login(credentials);
    setUser(response.user);
  } catch (error) {
    // Atualiza estado de erro na UI
    setError(error.message);
  }
};
```

---

## 📚 Exemplos de Uso

### Exemplo 1: Login com Tratamento de Erro

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login({
        email: data.email,
        password: data.password
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {/* campos do formulário */}
    </form>
  );
}
```

### Exemplo 2: Rota Protegida

```typescript
import { useRequireAuth } from '@/contexts/AuthContext';

function DashboardPage() {
  const { user, isLoading } = useRequireAuth(); // Redireciona se não autenticado

  if (isLoading) return <div>Carregando...</div>;

  return <div>Bem-vindo, {user.name}!</div>;
}
```

### Exemplo 3: Logout

```typescript
function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header>
      {isAuthenticated && (
        <>
          <span>{user?.name}</span>
          <button onClick={handleLogout}>Sair</button>
        </>
      )}
    </header>
  );
}
```

### Exemplo 4: Criar Novo Módulo (Tickets)

```typescript
// 1. Entity
// src/domain/entities/Ticket.ts
export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  quantity: number;
}

// 2. Repository Interface
// src/domain/repositories/ITicketRepository.ts
export interface ITicketRepository {
  purchase(data: PurchaseData): Promise<Ticket>;
  getUserTickets(userId: string): Promise<Ticket[]>;
}

// 3. Service
// src/domain/services/TicketService.ts
export class TicketService {
  constructor(private ticketRepo: ITicketRepository) {}

  async purchaseTicket(data: PurchaseData): Promise<Ticket> {
    // Validação de negócio
    if (data.quantity <= 0) {
      throw new Error("Quantidade inválida");
    }
    return await this.ticketRepo.purchase(data);
  }
}

// 4. Repository Implementation
// src/data/repositories/TicketRepositoryImpl.ts
export class TicketRepositoryImpl implements ITicketRepository {
  constructor(private httpClient: HttpClient) {}

  async purchase(data: PurchaseData): Promise<Ticket> {
    return await this.httpClient.post<Ticket>("/tickets/purchase", data);
  }
}

// 5. Container
// src/data/di/container.ts
const ticketRepository = new TicketRepositoryImpl(httpClient);
export const ticketService = new TicketService(ticketRepository);

// 6. Context
// src/contexts/TicketContext.tsx
export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const purchaseTicket = async (data: PurchaseData) => {
    const ticket = await ticketService.purchaseTicket(data);
    setTickets(prev => [...prev, ticket]);
  };

  return <TicketContext.Provider value={{ tickets, purchaseTicket }}>
    {children}
  </TicketContext.Provider>;
}
```

---

## 🧪 Testabilidade

### Testando Services

```typescript
import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '@/domain/services/AuthService';
import type { IAuthRepository } from '@/domain/repositories/IAuthRepository';

describe('AuthService', () => {
  it('deve fazer login com sucesso', async () => {
    // Mock do repository
    const mockRepo: IAuthRepository = {
      login: vi.fn().mockResolvedValue({
        user: { id: '1', name: 'Test', email: 'test@test.com' },
        token: 'fake-token'
      }),
      register: vi.fn(),
      logout: vi.fn(),
      validateToken: vi.fn()
    };

    const service = new AuthService(mockRepo);

    const result = await service.login({
      email: 'test@test.com',
      password: '12345678'
    });

    expect(result.user.name).toBe('Test');
    expect(mockRepo.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '12345678'
    });
  });
});
```

### Testando Repositories

```typescript
import { describe, it, expect, vi } from 'vitest';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';

describe('AuthRepositoryImpl', () => {
  it('deve chamar API com credenciais corretas', async () => {
    const mockHttpClient = {
      post: vi.fn().mockResolvedValue({
        user: { id: '1', name: 'Test', email: 'test@test.com' },
        token: 'fake-token'
      }),
      get: vi.fn(),
      setToken: vi.fn(),
      clearToken: vi.fn()
    };

    const mockStorage = {
      saveToken: vi.fn(),
      saveUser: vi.fn(),
      getToken: vi.fn(),
      removeToken: vi.fn()
    };

    const repo = new AuthRepositoryImpl(mockHttpClient as any, mockStorage as any);

    await repo.login({ email: 'test@test.com', password: '12345678' });

    expect(mockHttpClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: '12345678'
    });
    expect(mockStorage.saveToken).toHaveBeenCalledWith('fake-token');
  });
});
```

---

## 🎓 Resumo

### Quando usar cada camada:

| Camada | Quando usar | Exemplo |
|--------|-------------|---------|
| **Entities** | Modelar dados do domínio | `User`, `Event`, `Ticket` |
| **Repository Interface** | Definir contrato de dados | `IAuthRepository.login()` |
| **Service** | Lógica de negócio complexa | Validações, regras, orquestração |
| **Repository Impl** | Integração com APIs | Chamadas HTTP, transformação de DTOs |
| **HttpClient** | Configuração global HTTP | Interceptors, baseURL, timeout |
| **Storage** | Persistência local | Salvar tokens, cache, preferências |
| **Context** | Estado global da UI | Gerenciar loading, user, errors |

### Checklist de Nova Feature:

- [ ] Criar entity em `domain/entities/`
- [ ] Criar interface em `domain/repositories/`
- [ ] Criar service em `domain/services/`
- [ ] Implementar repository em `data/repositories/`
- [ ] Registrar no `data/di/container.ts`
- [ ] Criar context em `contexts/` (se precisar estado global)
- [ ] Adicionar provider em `__root.tsx` (se criou context)
- [ ] Usar no componente via hook

---

## 📞 Próximos Passos

1. **Implementar refresh token** - Renovar token automaticamente
2. **Adicionar error boundaries** - Tratamento de erros global
3. **Implementar route guards** - Proteção de rotas com `beforeLoad`
4. **Adicionar logging** - Service de logs centralizados
5. **Criar testes** - Testes unitários e de integração
6. **Implementar módulos** - Events, Tickets, Payments

---

**Documentação gerada em:** Fevereiro 2026  
**Versão:** 1.0.0  
**Projeto:** TicketHub - Clean Architecture
