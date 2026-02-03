# TicketHub - Context for LLMs

## Project Overview
**TicketHub** is a modern ticket sales platform built with TanStack Start. Currently focused on UI development only - **no API integration yet**.

## Tech Stack
- **Framework**: TanStack Start (React 19.2.0)
- **Routing**: TanStack Router (file-based routing)
- **State**: TanStack Query
- **Styling**: Tailwind CSS 4.0.6 + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript 5.7.2
- **Linter/Formatter**: Biome.js 2.2.4 (replaces ESLint + Prettier)

## Design System
- **Theme**: Black and white (monochromatic) using shadcn/ui defaults
- **Components**: shadcn/ui components in `src/components/ui/`
- **Icons**: Lucide React
- **Color Classes**: Use semantic tokens (`bg-background`, `text-foreground`, `bg-primary`, `bg-accent`, etc.)

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Input, Card, etc.)
│   └── Header.tsx       # Main navigation header
├── lib/
│   ├── schemas/         # Zod validation schemas
│   │   └── auth.schema.ts
│   └── utils.ts         # Utility functions (cn helper)
├── routes/              # File-based routing
│   ├── __root.tsx       # Root layout
│   ├── index.tsx        # Landing page
│   ├── login.tsx        # Login page
│   ├── cadastro.tsx     # Registration page
│   └── demo/            # Demo routes
└── styles.css           # Global styles + Tailwind imports
```

## Key Implementation Details

### Forms
- All forms use **React Hook Form** with **Controller**
- Validation with **Zod schemas** in `src/lib/schemas/`
- No API calls - forms simulate delays but don't persist data

### Routing
- File-based routing in `src/routes/`
- Use `createFileRoute` for each route
- `routeTree.gen.ts` is auto-generated
- Navigate with `<Link to="/path">` from `@tanstack/react-router`

### Styling
- Always use **Tailwind utility classes**
- Use `cn()` from `@/lib/utils` for conditional classes
- Stick to shadcn/ui theme colors (no custom colors like violet/purple/cyan)
- Theme supports dark mode via `.dark` class

### Components
- Use shadcn/ui components from `@/components/ui/`
- Import path alias: `@/` maps to `src/`
- Keep components functional with TypeScript types

### Code Quality
- **Biome.js** handles both linting and formatting (single tool)
- Config: `biome.json` with tab indentation and double quotes
- Auto-organizes imports on save
- Ignores: `routeTree.gen.ts` and `styles.css`

## Common Commands
```bash
pnpm dev         # Development server (port 3000)
pnpm build       # Production build
pnpm lint        # Biome linter
pnpm format      # Biome formatter
```

## Important Notes
1. **No API integration** - all data is mocked/simulated
2. **UI only** - focus on components, forms, and user experience
3. **Theme consistency** - maintain black/white color scheme
4. **Type safety** - everything is typed with TypeScript
5. Authentication is **simulated** - forms work but don't authenticate

## When Adding Features
- Create new routes in `src/routes/` (file-based routing)
- Add Zod schemas in `src/lib/schemas/` for validation
- Use existing shadcn/ui components or add new ones with `pnpm dlx shadcn@latest add <component>`
- Keep styling consistent with black/white theme
- No API calls - simulate with delays/console.log

## File Naming Conventions
- Routes: `kebab-case.tsx` (e.g., `login.tsx`, `cadastro.tsx`)
- Components: `PascalCase.tsx` (e.g., `Header.tsx`, `Button.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`, `auth.schema.ts`)
