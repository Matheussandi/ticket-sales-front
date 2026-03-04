# 🎫 TicketHub — Plataforma de Venda de Ingressos

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.6-38bdf8?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff?logo=vite&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-22c55e)

## Sobre o Projeto

**TicketHub** é uma plataforma moderna de venda de ingressos online desenvolvida com **React**, **TypeScript** e **Clean Architecture**. O projeto oferece uma experiência rápida, segura e intuitiva para compra de ingressos para shows, festivais, teatros e eventos esportivos.

> Frontend desenvolvido como parte de um estudo prático de arquitetura limpa com o ecossistema TanStack.

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**, separando responsabilidades em camadas bem definidas:

```
src/
├── domain/        # Entidades, repositórios (interfaces) e serviços de negócio
├── data/          # Implementações: HTTP, repositórios, storage e injeção de dependências
├── components/    # Componentes UI reutilizáveis (shadcn/ui)
├── routes/        # Páginas via file-based routing (TanStack Router)
├── hooks/         # Custom hooks para queries e mutations
└── contexts/      # Estado global (AuthContext)
```

## 🚀 Tecnologias

| Categoria | Tecnologias |
|---|---|
| **Core** | React 19, TypeScript 5.7, Vite 7 |
| **Roteamento & Data** | TanStack Router, TanStack Query |
| **Estilização** | Tailwind CSS 4, shadcn/ui, Lucide React |
| **Formulários** | React Hook Form, Zod |
| **HTTP** | Axios |
| **Qualidade** | Biome (lint + format), Vitest |

## ✅ Funcionalidades

- **Landing page** responsiva com hero section e call-to-action
- **Autenticação** — login, cadastro e recuperação de senha com validação em tempo real
- **Dashboard** — visão geral de eventos e ingressos
- **Eventos** — listagem, detalhes e criação de eventos
- **Ingressos** — compra e acompanhamento de ingressos
- **Perfil** — atualização de dados do usuário

## 🛠️ Como Executar

**Pré-requisitos:** Node.js 18+ e pnpm

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd vendas-ingresso-front

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse em `http://localhost:3000`.

### Scripts disponíveis

```bash
pnpm dev      # Servidor de desenvolvimento
pnpm build    # Build de produção
pnpm test     # Testes com Vitest
pnpm check    # Lint + format com Biome
```

## 📄 Licença

Este projeto está sob a licença MIT.
