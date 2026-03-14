# Módulo de Perfil

Documentação do sistema de gerenciamento de perfil de usuário.

## Visão Geral

O módulo permite que todos os usuários (partners e customers) atualizem suas informações pessoais e alterem sua senha através de uma interface segura.

## Funcionalidades

### 1. Atualização de Dados Pessoais

Permite que o usuário atualize:
- Nome completo
- Email de acesso

### 2. Alteração de Senha

Permite que o usuário altere sua senha com validações de segurança:
- Confirmação da senha atual
- Validação da nova senha (mínimo 8 caracteres)
- Confirmação da nova senha

## Schemas de Validação

### UpdateProfile

```typescript
const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
});
```

### UpdatePassword

```typescript
const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(1, "Nova senha é obrigatória")
    .min(8, "Nova senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});
```

## Fluxo de Uso

### 1. Acessar Página de Perfil

1. Usuário faz login (partner ou customer)
2. Clica em "Perfil" na sidebar
3. Acessa `/profile`

### 2. Atualizar Informações Pessoais

1. Visualiza formulário pré-preenchido com dados atuais
2. Edita nome e/ou email
3. Clica em "Salvar Alterações"

**O que acontece:**
- Sistema envia `PUT /profile` com novos dados
- API valida e atualiza as informações
- Token storage é atualizado com novos dados
- Contexto de autenticação é atualizado automaticamente
- Usuário vê toast de sucesso

### 3. Alterar Senha

1. Rola até seção "Segurança"
2. Preenche:
   - Senha atual
   - Nova senha (mínimo 8 caracteres)
   - Confirmação da nova senha
3. Clica em "Alterar Senha"

**O que acontece:**
- Sistema valida que as senhas conferem
- AuthService valida que a nova senha é diferente da atual
- Envia `PUT /profile/password` com senhas
- API valida senha atual e atualiza
- Formulário é limpo automaticamente
- Usuário vê toast de sucesso

## Arquitetura

### Domain Layer

**Entities:** [src/domain/entities/User.ts](src/domain/entities/User.ts)
```typescript
export const updateProfileSchema = z.object({ ... });
export const updatePasswordSchema = z.object({ ... });
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;
```

**Repository Interface:** [src/domain/repositories/IAuthRepository.ts](src/domain/repositories/IAuthRepository.ts)
```typescript
interface IAuthRepository {
  updateProfile(data: UpdateProfileData): Promise<User>;
  updatePassword(data: UpdatePasswordData): Promise<void>;
}
```

**Service:** [src/domain/services/AuthService.ts](src/domain/services/AuthService.ts)
- `updateProfile(data)`: Atualiza dados pessoais
- `updatePassword(data)`: Valida e atualiza senha

### Data Layer

**Repository Implementation:** [src/data/repositories/AuthRepositoryImpl.ts](src/data/repositories/AuthRepositoryImpl.ts)
- `updateProfile()`: `PUT /profile` - atualiza user no storage
- `updatePassword()`: `PUT /profile/password`

### Presentation Layer

**Hooks:**
- [src/hooks/mutations/useUpdateProfile.ts](src/hooks/mutations/useUpdateProfile.ts) - Mutation para atualizar perfil
- [src/hooks/mutations/useUpdatePassword.ts](src/hooks/mutations/useUpdatePassword.ts) - Mutation para alterar senha

**Components:**
- [src/routes/_authenticated/profile.tsx](src/routes/_authenticated/profile.tsx) - Página de perfil com dois formulários separados

## Validações de Negócio

### No AuthService

1. **updatePassword:**
   - Valida que newPassword ≠ currentPassword
   - Lança erro se forem iguais

### No Frontend (Zod)

1. **updateProfile:**
   - Nome: mínimo 3 caracteres
   - Email: formato válido

2. **updatePassword:**
   - Senha atual: obrigatória
   - Nova senha: mínimo 8 caracteres
   - Confirmação: deve ser igual à nova senha

## UI/UX

### Layout

A página de perfil contém dois cards separados:

1. **Card "Informações Pessoais":**
   - Ícone de usuário no header
   - Campos: Nome, Email
   - Botão: "Salvar Alterações"
   - Loading state durante salvamento

2. **Card "Segurança":**
   - Campos: Senha Atual, Nova Senha, Confirmar Nova Senha
   - Botão: "Alterar Senha"
   - Loading state durante alteração
   - Formulário é limpo após sucesso

### Estados

- **Loading:** Botões desabilitados com spinner
- **Success:** Toast verde + atualização automática
- **Error:** Toast vermelho com mensagem de erro

## Tratamento de Erros

### Erros Comuns

| Erro | Causa | Tratamento |
|------|-------|------------|
| 400 Bad Request | Dados inválidos | Toast com mensagem específica |
| 401 Unauthorized | Senha atual incorreta | Toast "Senha atual incorreta" |
| 409 Conflict | Email já existe | Toast "Este email já está em uso" |

### Mensagens de Toast

**Sucesso:**
- "Perfil atualizado com sucesso!"
- "Senha alterada com sucesso!"

**Erro:**
- Mensagem específica da API ou mensagem genérica

## Segurança

1. **Autenticação:** Todas as rotas requerem token válido
2. **Validação de Senha:** Backend valida senha atual antes de alterar
3. **Senha Diferente:** Frontend impede que nova senha = senha atual
4. **Token Atualizado:** Após update de perfil, user no storage é atualizado

## Dependências

- **TanStack Query:** Gerenciamento de mutations
- **React Hook Form:** Gerenciamento de formulários
- **Zod:** Validação de schemas
- **Sonner:** Notificações toast
- **shadcn/ui:** Componentes de UI (Card, Input, Button, Form)

## Navegação

A página de perfil é acessível via:
- Sidebar → "Perfil" (disponível para partners e customers)
- URL: `/profile` (rota autenticada)

## Contexto de Autenticação

### Método updateUser

Foi adicionado ao AuthContext para permitir atualização local do usuário:

```typescript
const updateUser = (updatedUser: User): void => {
  setUser(updatedUser);
};
```

Usado pelo `useUpdateProfile` hook para atualizar o estado global após sucesso.
