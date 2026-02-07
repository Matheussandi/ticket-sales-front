# TicketHub - Sistema de Vendas de Ingressos

## Arquitetura

Projeto React com Clean Architecture, separando domínio, dados e apresentação.

## Stack
- React 19 + TanStack Start + TanStack Router (file-based)
- TypeScript 5.7
- Tailwind CSS 4 + shadcn/ui
- Context API + TanStack Query
- React Hook Form + Zod
- Axios
- Biome.js

## Estrutura

```
src/
├── domain/              # Regras de negócio
│   ├── entities/        # User.ts (types + Zod schemas)
│   ├── repositories/    # IAuthRepository.ts (interfaces)
│   └── services/        # AuthService.ts (lógica de negócio)
├── data/                # Implementações
│   ├── http/            # HttpClient.ts (axios wrapper)
│   ├── repositories/    # AuthRepositoryImpl.ts
│   ├── storage/         # TokenStorage.ts (localStorage)
│   └── di/              # container.ts (dependency injection)
├── contexts/            # AuthContext.tsx (estado global)
├── routes/              # Páginas (TanStack Router file-based)
├── components/          # Componentes UI (shadcn/ui)
└── config/              # env.ts
```

## Fluxo de Login

```
login.tsx → useAuth() → authService.login() → authRepository.login() → httpClient.post() → API
```

## Comandos

```bash
pnpm dev      # Desenvolvimento (porta 3000)
pnpm build    # Build produção
pnpm check    # Lint + Format
```

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
