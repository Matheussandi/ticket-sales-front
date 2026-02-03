# 🎫 TicketHub - Plataforma de Venda de Ingressos

![TanStack Start](https://img.shields.io/badge/TanStack-Start-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.6-38bdf8)

## 📝 Sobre o Projeto

**TicketHub** é uma plataforma moderna de venda de ingressos online, desenvolvida para oferecer aos usuários uma experiência rápida, segura e intuitiva na compra de ingressos para shows, festivais, teatros e eventos esportivos.

Este projeto está atualmente em fase de desenvolvimento da interface (UI), com foco na criação de componentes reutilizáveis e uma experiência de usuário excepcional. A integração com a API será implementada em uma fase posterior.

## 🚀 Tecnologias Utilizadas

### Core
- **[React.js 19.2.0](https://react.dev/)** - Biblioteca JavaScript para construção de interfaces
- **[TanStack Start](https://tanstack.com/start)** - Framework full-stack para React com SSR
- **[TanStack Router](https://tanstack.com/router)** - Roteamento type-safe com file-based routing
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado assíncrono
- **[TypeScript 5.7.2](https://www.typescriptlang.org/)** - Tipagem estática para JavaScript

### Estilização
- **[Tailwind CSS 4.0.6](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Biblioteca de componentes reutilizáveis
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones
- **[class-variance-authority](https://cva.style/)** - Gerenciamento de variantes de componentes

### Formulários e Validação
- **[React Hook Form 7.71.1](https://react-hook-form.com/)** - Biblioteca para gerenciamento de formulários
- **[Zod 4.3.6](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Integração entre React Hook Form e Zod

### Build e Desenvolvimento
- **[Vite 7.1.7](https://vite.dev/)** - Build tool e dev server
- **[Vitest 3.0.5](https://vitest.dev/)** - Framework de testes
- **[Biome 2.2.4](https://biomejs.dev/)** - Linter e formatter

## 🎯 Funcionalidades Implementadas

### ✅ Landing Page
- Hero section com headline atrativa e call-to-action
- Seção de benefícios e funcionalidades da plataforma
- Cards de features com animações e hover effects
- Footer completo com links úteis
- Design responsivo e moderno
- Tema com paleta violet/purple para eventos

### ✅ Autenticação (UI)
- **Página de Login**
  - Formulário com validação em tempo real
  - Campos: email e senha
  - Mensagens de erro personalizadas
  - Link para recuperação de senha
  - Navegação para cadastro

- **Página de Cadastro**
  - Formulário completo com validação
  - Campos: nome, email, senha e confirmação de senha
  - Validação de senha forte (maiúsculas, minúsculas e números)
  - Verificação de confirmação de senha
  - Termos de uso e política de privacidade

### ✅ Componentes Reutilizáveis
- Button (com variantes)
- Input e Label
- Card (Header, Content, Footer)
- Form (integrado com React Hook Form)
- Separator

### ✅ Header Atualizado
- Logo da plataforma (TicketHub)
- Botões "Entrar" e "Cadastrar" no canto superior direito
- Menu lateral responsivo com navegação
- Tema consistente com a landing page

## 📂 Estrutura do Projeto

```
vendas-ingresso-front/
├── public/                      # Arquivos estáticos
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/              # Componentes React
│   │   ├── ui/                  # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── separator.tsx
│   │   └── Header.tsx           # Header com navegação
│   ├── data/                    # Dados mockados/estáticos
│   │   └── demo.punk-songs.ts
│   ├── integrations/            # Integrações de terceiros
│   │   └── tanstack-query/
│   │       ├── devtools.tsx
│   │       └── root-provider.tsx
│   ├── lib/                     # Utilitários e helpers
│   │   ├── schemas/             # Schemas de validação Zod
│   │   │   └── auth.schema.ts   # Validação de login/cadastro
│   │   └── utils.ts             # Função cn() para merge de classes
│   ├── routes/                  # Rotas da aplicação (file-based)
│   │   ├── __root.tsx           # Layout root
│   │   ├── index.tsx            # Landing page
│   │   ├── login.tsx            # Página de login
│   │   ├── cadastro.tsx         # Página de cadastro
│   │   └── demo/                # Rotas de demonstração
│   ├── router.tsx               # Configuração do router
│   ├── routeTree.gen.ts         # Tree de rotas (auto-gerado)
│   └── styles.css               # Estilos globais + Tailwind
├── biome.json                   # Configuração do Biome
├── components.json              # Configuração do shadcn/ui
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Como Rodar o Projeto Localmente

### Pré-requisitos
- **Node.js** 18+ instalado
- **pnpm** instalado (ou npm/yarn)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd vendas-ingresso-front
```

2. Instale as dependências:
```bash
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

4. Acesse a aplicação:
```
http://localhost:3000
```

## 📦 Scripts Disponíveis

```bash
pnpm dev         # Inicia o servidor de desenvolvimento na porta 3000
pnpm build       # Cria build de produção
pnpm preview     # Preview do build de produção
pnpm test        # Executa os testes com Vitest
pnpm lint        # Executa o linter (Biome)
pnpm format      # Formata o código (Biome)
pnpm check       # Verifica código (lint + format)
```

## 🧪 Testes

O projeto utiliza **[Vitest](https://vitest.dev/)** para testes:

```bash
pnpm test
```

## 🎨 Adicionando Componentes shadcn/ui

Para adicionar novos componentes do shadcn/ui:

```bash
pnpm dlx shadcn@latest add <nome-do-componente>
```

Exemplo:
```bash
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
pnpm dlx shadcn@latest add toast
```

## 📐 Padrões de Código

### Componentes
- Use **PascalCase** para nomes de componentes
- Crie componentes funcionais com TypeScript
- Use props tipadas com interfaces/types

### Rotas
- Use **kebab-case** para arquivos de rotas
- Utilize file-based routing do TanStack Router
- Arquivos em `src/routes/` geram rotas automaticamente

### Formulários
- Use **React Hook Form** com **Controller** para campos controlados
- Valide com **Zod schemas** definidos em `src/lib/schemas/`
- Utilize componentes do shadcn/ui (Input, Label, Form)

### Estilização
- Use **Tailwind CSS** utility classes
- Utilize a função `cn()` de `@/lib/utils` para merge condicional de classes
- Mantenha consistência com a paleta preto e branco do shadcn/ui
- Aproveite as CSS variables do tema (background, foreground, primary, accent, etc.)

## 🔮 Próximas Etapas

- [ ] Integração com API backend
- [ ] Autenticação real com JWT/OAuth
- [ ] Listagem de eventos disponíveis
- [ ] Sistema de carrinho de compras
- [ ] Página de checkout
- [ ] Integração com gateway de pagamento
- [ ] Painel do usuário (meus ingressos)
- [ ] Sistema de QR Code para ingressos
- [ ] Notificações por email
- [ ] Modo escuro (dark mode)
- [ ] Internacionalização (i18n)
- [ ] Testes E2E com Playwright

## ⚠️ Observações Importantes

### API
**A integração com a API será implementada posteriormente.** Atualmente, o projeto contém apenas a interface (UI) das páginas, com formulários funcionais mas sem conexão real com backend.

Os formulários de login e cadastro simulam requisições com delays, mas não persistem dados ou autenticam usuários de fato.

### Estrutura de Dados
Quando a API for integrada, será necessário:
- Configurar endpoints de autenticação
- Implementar gerenciamento de tokens (localStorage/cookies)
- Adicionar interceptors para requisições autenticadas
- Implementar tratamento de erros da API
- Adicionar estados de loading/error nas páginas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido com

- ❤️ Paixão por criar experiências incríveis
- ⚡ TanStack ecosystem
- 🎨 Design moderno e responsivo
- 🔒 Segurança e validação em mente

---

**TicketHub** - Transformando a forma como você compra ingressos! 🎫
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
