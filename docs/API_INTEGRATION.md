# API Integration Guide

## 🌐 Overview

Este guia explica como integrar o front-end com a API backend de autenticação.

---

## 📍 Endpoints Esperados

### Base URL

```
Desenvolvimento: http://localhost:3001
Produção: https://api.tickethub.com
```

Configure em `.env.development` e `.env.production`.

---

## 🔐 Autenticação

### 1. Login

**POST** `/auth/login`

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "SenhaForte123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "usuario@exemplo.com",
    "createdAt": "2026-02-04T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Credenciais inválidas

---

### 2. Registro

**POST** `/auth/register`

**Request:**
```json
{
  "name": "João Silva",
  "email": "usuario@exemplo.com",
  "password": "SenhaForte123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "usuario@exemplo.com",
    "createdAt": "2026-02-04T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400 Bad Request` - Dados inválidos
- `409 Conflict` - Email já cadastrado

---

### 3. Logout

**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204 No Content)**

**Errors:**
- `401 Unauthorized` - Token inválido

---

### 4. Validar Token

**GET** `/auth/validate`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "uuid-v4",
    "name": "João Silva",
    "email": "usuario@exemplo.com"
  }
}
```

**Errors:**
- `401 Unauthorized` - Token inválido ou expirado

---

## 🔑 Autenticação JWT

### Formato do Token

O front-end espera receber um **JWT (JSON Web Token)** no formato:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Fluxo de Autenticação

1. **Login/Registro bem-sucedido:**
   - API retorna `{ user, token }`
   - Front-end salva token no `localStorage` (key: `@tickethub:token`)
   - Front-end salva user no `localStorage` (key: `@tickethub:user`)

2. **Requisições subsequentes:**
   - `HttpClient` adiciona automaticamente header `Authorization: Bearer <token>`
   - Via interceptor do axios

3. **Token expirado (401):**
   - Interceptor detecta erro 401
   - Remove token do `localStorage`
   - Redireciona para `/login` (opcional, atualmente comentado)

4. **Logout:**
   - Chama `POST /auth/logout`
   - Remove token e user do `localStorage`
   - Limpa header de Authorization

---

## 🛠️ Testando a Integração

### Mock Server (Desenvolvimento)

Enquanto a API real não está pronta, você pode usar um **mock server**.

#### Opção 1: JSON Server

1. Instalar:
```bash
pnpm add -D json-server
```

2. Criar `db.json`:
```json
{
  "users": [
    {
      "id": "1",
      "name": "Test User",
      "email": "test@test.com",
      "password": "$2a$10$..." 
    }
  ]
}
```

3. Criar `server.js`:
```javascript
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Mock login
server.post('/auth/login', (req, res) => {
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
