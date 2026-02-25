# API Integration

## Base URL

Configure em `.env.development`:
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

## Endpoints

### POST /auth/login
Request:
```json
{ "email": "usuario@exemplo.com", "password": "SenhaForte123" }
```
Response (200):
```json
{
  "user": { "id": "uuid", "name": "João", "email": "usuario@exemplo.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Errors: 400 (dados inválidos), 401 (credenciais inválidas)

### POST /auth/register
Request:
```json
{ "name": "João", "email": "usuario@exemplo.com", "password": "SenhaForte123" }
```
Response (201): igual a login
Errors: 400 (dados inválidos), 409 (email já existe)

### POST /auth/logout
Headers: `Authorization: Bearer <token>`
Response: 204 No Content

### GET /auth/validate
Headers: `Authorization: Bearer <token>`
Response (200):
```json
{
  "valid": true,
  "user": { "id": "uuid", "name": "João", "email": "usuario@exemplo.com" }
}
```

---

## Perfil

### PUT /profile
Headers: `Authorization: Bearer <token>`
Request:
```json
{
  "name": "João Silva",
  "email": "joao.silva@exemplo.com"
}
```
Response (200):
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao.silva@exemplo.com",
  "role": "customer"
}
```
Errors: 400 (dados inválidos), 401 (não autenticado), 409 (email já existe)

### PUT /profile/password
Headers: `Authorization: Bearer <token>`
Request:
```json
{
  "currentPassword": "SenhaAtual123",
  "newPassword": "NovaSenha456"
}
```
Response: 204 No Content
Errors: 400 (dados inválidos), 401 (senha atual incorreta)

---

## Eventos

### POST /events
Headers: `Authorization: Bearer <token>` (apenas Partners)
Request:
```json
{
  "name": "Festival de Música 2026",
  "description": "Maior festival do ano",
  "date": "2026-09-15T18:00:00Z",
  "location": "São Paulo - SP"
}
```
Response (201):
```json
{
  "id": 1,
  "name": "Festival de Música 2026",
  "description": "Maior festival do ano",
  "date": "2026-09-15T18:00:00Z",
  "location": "São Paulo - SP",
  "created_at": "2026-02-24T23:00:00Z",
  "partner_id": 1
}
```
Errors: 400 (dados inválidos), 401 (não autenticado), 403 (não é partner)

### GET /events
Opções de filtros via query params:
- `?name=Festival` - busca por nome
- `?date=2026-09-15` - busca por data
- `?location=São Paulo` - busca por localização

Response (200):
```json
[
  {
    "id": 1,
    "name": "Festival de Música 2026",
    "description": "Maior festival do ano",
    "date": "2026-09-15T18:00:00Z",
    "location": "São Paulo - SP",
    "created_at": "2026-02-24T23:00:00Z",
    "partner_id": 1
  }
]
```

---

## Tickets

### POST /events/:eventId/tickets
Headers: `Authorization: Bearer <token>` (apenas Partners)
Request:
```json
{
  "num_tickets": 10,
  "price": 50.00
}
```
Response: 204 No Content

**O que acontece:**
- API cria N tickets para o evento
- Cada ticket recebe location automática: "Location 1", "Location 2", etc.
- Todos começam com status `available`

Errors: 400 (dados inválidos), 401 (não autenticado), 403 (não é partner), 404 (evento não existe)

### GET /events/:eventId/tickets
Response (200):
```json
[
  {
    "id": 1,
    "location": "Location 1",
    "event_id": 1,
    "price": "50.00",
    "status": "available",
    "created_at": "2026-02-24T23:01:51.000Z"
  },
  {
    "id": 2,
    "location": "Location 2",
    "event_id": 1,
    "price": "50.00",
    "status": "sold",
    "created_at": "2026-02-24T23:01:51.000Z"
  }
]
```

**Status possíveis:**
- `available`: Disponível para compra
- `sold`: Já vendido
- `reserved`: Reservado (futuro)

---

## Compras

### POST /purchases
Headers: `Authorization: Bearer <token>` (apenas Customers)
Request:
```json
{
  "ticket_ids": [1, 2, 3],
  "card_token": "tok_visa"
}
```
Response (200):
```json
{
  "id": 1,
  "customer_id": 1,
  "purchase_date": "2026-02-24T23:05:55.000Z",
  "total_amount": "150.00",
  "status": "paid"
}
```

**O que acontece:**
- API valida se todos os tickets estão `available`
- Processa pagamento com o `card_token`
- Marca tickets como `sold`
- Cria registro da compra

**Card Tokens Mock (desenvolvimento):**
- `tok_visa` - Visa •••• 4242
- `tok_mastercard` - Mastercard •••• 5555
- `tok_amex` - American Express •••• 0005

Errors: 
- 400 (dados inválidos ou tickets indisponíveis)
- 401 (não autenticado)
- 403 (não é customer)
- 404 (tickets não existem)
- 422 (erro no pagamento)

### GET /purchases
Headers: `Authorization: Bearer <token>` (apenas Customers)
Response (200):
```json
[
  {
    "id": 1,
    "customer_id": 1,
    "purchase_date": "2026-02-24T23:05:55.000Z",
    "total_amount": "150.00",
    "status": "paid",
    "event": {
      "id": 1,
      "name": "Festival de Música 2026",
      "description": "Maior festival do ano",
      "date": "2026-09-15T18:00:00Z",
      "location": "São Paulo - SP",
      "created_at": "2026-02-24T23:00:00Z",
      "partner_id": 1
    },
    "tickets": [
      {
        "id": 1,
        "location": "Location 1",
        "event_id": 1,
        "price": "50.00",
        "status": "sold",
        "created_at": "2026-02-24T23:01:51.000Z"
      },
      {
        "id": 2,
        "location": "Location 2",
        "event_id": 1,
        "price": "50.00",
        "status": "sold",
        "created_at": "2026-02-24T23:01:51.000Z"
      }
    ]
  }
]
```

**Descrição:**
- Retorna todas as compras do customer logado
- Inclui detalhes do evento e tickets associados
- Ordenado por data de compra (mais recente primeiro)

Errors:
- 401 (não autenticado)
- 403 (não é customer)

---

## Autenticação JWT

- Token salvo em `localStorage` (key: `@tickethub:token`)
- HttpClient adiciona automaticamente header `Authorization: Bearer <token>`
- Erro 401 remove token e redireciona para login

## Tratamento de Erros

| Código | Mensagem |
|--------|----------|
| 400 | Dados inválidos |
| 401 | Credenciais/token inválido |
| 409 | Email já cadastrado |
| 500 | Erro no servidor |
| Timeout | Tempo esgotado |
  const { email, password } = req.body;
  
  if (email === 'test@test.com' && password === '12345678') {
    res.status(200).json({
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        createdAt: new Date().toISOString()
      },
      token: 'fake-jwt-token-12345'
    });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

// Mock register
server.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  res.status(201).json({
    user: {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      createdAt: new Date().toISOString()
    },
    token: 'fake-jwt-token-' + Math.random().toString(36).substr(2, 9)
  });
});

// Mock validate
server.get('/auth/validate', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token && token.startsWith('fake-jwt-token')) {
    res.status(200).json({
      valid: true,
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@test.com'
      }
    });
  } else {
    res.status(401).json({ message: 'Token inválido' });
  }
});

// Mock logout
server.post('/auth/logout', (req, res) => {
  res.status(204).send();
});

server.use(router);

server.listen(3001, () => {
  console.log('Mock API running on http://localhost:3001');
});
```

4. Rodar:
```bash
node server.js
```

#### Opção 2: MSW (Mock Service Worker)

1. Instalar:
```bash
pnpm add -D msw
```

2. Criar `src/mocks/handlers.ts`:
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/auth/login', async ({ request }) => {
    const { email, password } = await request.json();

    if (email === 'test@test.com' && password === '12345678') {
      return HttpResponse.json({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          createdAt: new Date().toISOString()
        },
        token: 'fake-jwt-token-12345'
      });
    }

    return HttpResponse.json(
      { message: 'Credenciais inválidas' },
      { status: 401 }
    );
  }),

  http.post('/auth/register', async ({ request }) => {
    const { name, email, password } = await request.json();

    return HttpResponse.json({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        createdAt: new Date().toISOString()
      },
      token: 'fake-jwt-token-' + Math.random().toString(36).substr(2, 9)
    }, { status: 201 });
  }),
];
```

---

## 🐛 Debugging

### Ver Requisições no DevTools

1. Abra o DevTools (F12)
2. Aba **Network**
3. Filtre por `XHR` ou `Fetch`
4. Veja requests para `/auth/*`

### Logs no Console

O `HttpClient` automaticamente loga erros:

```typescript
// Ative logs detalhados (desenvolvimento)
this.axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[HTTP]', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('[HTTP Error]', error.config?.url, error.message);
    return Promise.reject(error);
  }
);
```

### Inspecionar localStorage

```javascript
// No console do navegador:
localStorage.getItem('@tickethub:token');
localStorage.getItem('@tickethub:user');
```

---

## ⚠️ Tratamento de Erros

### Erros Esperados

O front-end trata os seguintes cenários:

| Código | Cenário | Comportamento |
|--------|---------|---------------|
| `400` | Dados inválidos | Exibe mensagem do backend |
| `401` | Credenciais inválidas | Exibe "Email ou senha inválidos" |
| `401` | Token expirado | Remove token, redireciona para login |
| `409` | Email já existe | Exibe "Email já cadastrado" |
| `500` | Erro do servidor | Exibe "Erro no servidor" |
| Timeout | Sem resposta | Exibe "Tempo de requisição esgotado" |
| Network | Sem conexão | Exibe "Erro de conexão" |

### Customizar Mensagens

Edite `AuthService`:

```typescript
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    return await this.authRepository.login(credentials);
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Email ou senha inválidos");
    }
    if (error.response?.status === 500) {
      throw new Error("Erro no servidor. Tente novamente mais tarde.");
    }
    throw new Error(error.response?.data?.message || "Erro ao fazer login");
  }
}
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

✅ **HTTPS em produção** - Obrigatório para transmissão de tokens  
✅ **Token no localStorage** - Vulnerável a XSS, considere `httpOnly cookies`  
✅ **Timeout configurável** - Evita requisições travadas  
✅ **Validação de token** - Verificação no servidor antes de confiar  
✅ **Logout limpa dados** - Remove token completamente  

### Melhorias Futuras

- [ ] **Refresh Token** - Renovar tokens expirados automaticamente
- [ ] **httpOnly Cookies** - Mais seguro que localStorage
- [ ] **Rate Limiting** - Limitar tentativas de login
- [ ] **2FA** - Autenticação de dois fatores

---

## 📊 Monitoramento

### Adicionar Analytics (Opcional)

```typescript
// domain/services/AuthService.ts
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await this.authRepository.login(credentials);
    
    // Analytics
    trackEvent('user_login', { userId: response.user.id });
    
    return response;
  } catch (error) {
    trackEvent('login_failed', { email: credentials.email });
    throw error;
  }
}
```

---

## 🧪 Testes de Integração

### Exemplo com Vitest

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { authService } from '@/data/di/container';

const server = setupServer(
  http.post('http://localhost:3001/auth/login', () => {
    return HttpResponse.json({
      user: { id: '1', name: 'Test', email: 'test@test.com' },
      token: 'fake-token'
    });
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());

describe('Auth Integration', () => {
  it('deve fazer login e salvar token', async () => {
    const result = await authService.login({
      email: 'test@test.com',
      password: '12345678'
    });

    expect(result.user.name).toBe('Test');
    expect(localStorage.getItem('@tickethub:token')).toBe('fake-token');
  });
});
```

---

## 📞 Contato com Backend

Ao integrar com a API real, confirme:

1. **Base URL** - URL correta para dev/prod
2. **Formato de resposta** - JSON com `user` e `token`
3. **Códigos de status** - 200, 201, 400, 401, 409, 500
4. **Headers CORS** - Backend deve permitir origem do front-end
5. **Formato do token** - JWT válido
6. **Expiração** - Tempo de validade do token (recomendado: 1h)

---

**Última atualização:** Fevereiro 2026
