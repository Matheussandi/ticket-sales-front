# Módulo de Tickets e Compras

Documentação do sistema de gestão de ingressos e compras.

## Visão Geral

O módulo permite que **partners** criem tickets para seus eventos e **customers** comprem esses tickets através de uma interface simplificada.

## Entidades

### Ticket

Representa um ingresso individual para um evento.

```typescript
interface Ticket {
  id: number;
  location: string;         // Ex: "Location 1", "Location 2"
  event_id: number;
  price: string;            // Decimal como string: "10.00"
  status: "available" | "sold" | "reserved";
  created_at: Date;
}
```

**Status possíveis:**
- `available`: Disponível para compra
- `sold`: Já vendido
- `reserved`: Reservado (não implementado no frontend)

### Purchase

Representa uma compra realizada por um customer.

```typescript
interface Purchase {
  id: number;
  customer_id: number;
  purchase_date: Date;
  total_amount: string;     // Decimal como string: "10.00"
  status: "paid" | "pending" | "cancelled";
}
```

## Fluxo de Uso

### 1. Partner: Criar Eventos com Tickets

1. Partner faz login
2. Acessa `/events`
3. Clica em "Criar Evento"
4. Preenche dados do evento (obrigatórios):
   - Nome
   - Descrição
   - Data e hora
   - Localização
5. **Opcionalmente**, define os tickets:
   - Quantidade (ex: 100)
   - Preço unitário (ex: 50.00)
6. Clica em "Salvar Evento"

**O que acontece:**
- Sistema cria o evento via `POST /events`
- Se houver dados de tickets, cria N tickets via `POST /events/:eventId/tickets`
- Cada ticket recebe automaticamente:
  - Uma localização única (`Location 1`, `Location 2`, etc.)
  - O preço definido
  - Status `available`

### 2. Customer: Visualizar Eventos

1. Customer faz login
2. Acessa `/events`
3. Vê lista de eventos com:
   - Nome, descrição, data, localização
   - Badge de status (Próximo/Realizado)
   - **Coluna "Ingressos"**: quantidade disponível
   - **Botão "Comprar"**: habilitado se evento é futuro e há tickets

### 3. Customer: Comprar Tickets

1. Clica em "Comprar" no evento desejado
2. Dialog abre mostrando:
   - Quantidade de ingressos disponíveis
   - Preço unitário
   - Campo de quantidade (min: 1, max: disponíveis)
   - Seleção de método de pagamento
   - Total calculado automaticamente
3. Seleciona quantidade e método de pagamento
4. Clica em "Confirmar Compra"

**O que acontece:**
- Sistema seleciona os primeiros N tickets disponíveis
- Envia `POST /purchases` com IDs dos tickets e `card_token`
- API processa pagamento e marca tickets como vendidos
- Customer recebe confirmação via toast
- Lista de compras é atualizada automaticamente

### 4. Customer: Visualizar Minhas Compras

1. Clica em "Meus Ingressos" no menu lateral
2. Vê lista de todas as compras realizadas com:
   - Nome e descrição do evento
   - Data e local do evento
   - Lista de ingressos comprados (location e preço)
   - Total pago
   - Status da compra (Pago/Pendente/Cancelado)
   - Data da compra

**O que acontece:**
- Sistema busca `GET /purchases` do usuário logado
- API retorna compras com detalhes de evento e tickets
- Lista ordenada por data (mais recente primeiro)

## Métodos de Pagamento

Tokens mock para simulação de gateway de pagamento:

```typescript
const PAYMENT_METHODS = [
  { value: "tok_visa", label: "Visa •••• 4242" },
  { value: "tok_mastercard", label: "Mastercard •••• 5555" },
  { value: "tok_amex", label: "American Express •••• 0005" },
];
```

> **Nota**: Em produção, integrar com gateway real (Stripe, Mercado Pago, etc.)

## Arquitetura

### Domain Layer

**Entidades:**
- [Ticket.ts](../src/domain/entities/Ticket.ts) - schemas Zod e tipos
- [Purchase.ts](../src/domain/entities/Purchase.ts) - schemas Zod e tipos

**Repositórios (interfaces):**
- [ITicketRepository.ts](../src/domain/repositories/ITicketRepository.ts)
- [IPurchaseRepository.ts](../src/domain/repositories/IPurchaseRepository.ts)

**Services:**
- [TicketService.ts](../src/domain/services/TicketService.ts) - validações de negócio
- [PurchaseService.ts](../src/domain/services/PurchaseService.ts) - validações de negócio

### Data Layer

**Implementações:**
- [TicketRepositoryImpl.ts](../src/data/repositories/TicketRepositoryImpl.ts) - chamadas HTTP
- [PurchaseRepositoryImpl.ts](../src/data/repositories/PurchaseRepositoryImpl.ts) - chamadas HTTP

**DI Container:**
- [container.ts](../src/data/di/container.ts) - instâncias singleton

### Presentation Layer

**Hooks:**
- [useCreateTickets.ts](../src/hooks/mutations/useCreateTickets.ts) - mutation para criar tickets
- [usePurchaseTickets.ts](../src/hooks/mutations/usePurchaseTickets.ts) - mutation para comprar
- [useTicketsByEvent.ts](../src/hooks/queries/useTicketsByEvent.ts) - queries para listar tickets
- [useMyPurchases.ts](../src/hooks/queries/useMyPurchases.ts) - query para listar compras do usuário

**Componentes:**
- [CreateEventDialog.tsx](../src/components/events/CreateEventDialog.tsx) - expandido com campos de tickets
- [PurchaseTicketDialog.tsx](../src/components/events/PurchaseTicketDialog.tsx) - dialog de compra
- [events/index.tsx](../src/routes/_authenticated/events/index.tsx) - listagem adaptada por role

**Páginas:**
- [tickets.tsx](../src/routes/_authenticated/tickets.tsx) - listagem de compras do customer

## Validações

### Criação de Tickets

**Client-side (Zod):**
```typescript
num_tickets: z.coerce.number().int().positive()
price: z.coerce.number().positive()
```

**Service:**
- `num_tickets > 0`
- `price > 0`

### Compra de Tickets

**Client-side (Zod):**
```typescript
ticket_ids: z.array(z.number()).min(1)
card_token: z.string().min(1)
```

**Service:**
- `ticket_ids` não vazio
- `card_token` não vazio
- Frontend verifica disponibilidade antes de enviar

## Cache e Invalidação (React Query)

**Query Keys:**
```typescript
["events", eventId, "tickets"]              // Lista de tickets de um evento
["events", eventId, "tickets", "available-count"]  // Contagem de disponíveis
["events"]                                  // Lista de eventos (afetada por compras)
["my-purchases"]                            // Lista de compras do customer
```

**Invalidações:**
- **Após criar tickets**: invalida `["events", eventId, "tickets"]` e `["events"]`
- **Após comprar tickets**: invalida `["events"]`, `["tickets"]` e `["my-purchases"]`

## Diferenças por Role

| Funcionalidade | Partner | Customer |
|----------------|---------|----------|
| Criar eventos | ✅ | ❌ |
| Adicionar tickets | ✅ (no form de evento) | ❌ |
| Ver coluna "Ingressos" | ❌ | ✅ |
| Botão "Comprar" | ❌ | ✅ |
| Ver "Criado em" | ✅ | ❌ |
| Acessar "Meus Ingressos" | ❌ | ✅ |

## Exemplos de Uso

### Criar Evento com 50 Tickets de R$ 100

```typescript
// Partner preenche o form:
{
  name: "Rock in Rio 2026",
  description: "Maior festival de música do Brasil",
  date: "2026-09-15T18:00",
  location: "Rio de Janeiro - RJ",
  num_tickets: 50,      // Opcional
  price: 100.00         // Opcional
}

// Sistema cria:
// 1. Evento (id: 123)
// 2. 50 tickets com locations "Location 1" até "Location 50"
```

### Customer Compra 3 Tickets

```typescript
// Customer seleciona:
{
  quantity: 3,
  card_token: "tok_visa"
}

// Sistema envia:
POST /purchases
{
  "ticket_ids": [1, 2, 3],  // Primeiros 3 disponíveis
  "card_token": "tok_visa"
}

// Resposta:
{
  "id": 456,
  "customer_id": 789,
  "purchase_date": "2026-02-24T23:05:55.000Z",
  "total_amount": "300.00",  // 3 × R$ 100
  "status": "paid"
}
```

## Melhorias Futuras

- [x] Histórico de compras do customer (`GET /purchases`) - **Implementado**
- [ ] Detalhes do evento com mapa de assentos
- [ ] Reserva temporária de tickets (status `reserved`)
- [ ] Cancelamento de compras
- [ ] Gateway de pagamento real
- [ ] Geração de QR Code para tickets
- [ ] Validação de tickets no evento
- [ ] Download de PDF com ingressos
- [ ] Notificações por email após compra
- [ ] Validação de tickets no evento

---

**Última atualização:** Fevereiro 2026  
**Versão:** 1.0.0
