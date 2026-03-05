# Cha de Panela - Gustavo & Rebeca

Aplicacao web para:
- pagina publica do evento
- confirmacao de presenca
- lista de presentes com reserva/pagamento
- painel administrativo protegido por login Supabase

Projeto em Next.js + Supabase, pronto para deploy na Vercel.

## Stack
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Lucide React (icones)

## Funcionalidades
- Home com informacoes do evento, link de localizacao e chave Pix.
- Confirmacao de presenca em formulario publico.
- Lista de presentes publica com duas opcoes:
  - marcar como `pago` (Pix)
  - marcar como `reservado` (compra fisica)
- Painel admin com:
  - dashboard de metricas
  - CRUD de presentes
  - listagem de convidados
- Protecao de rotas `/admin/*` por sessao Supabase.
- Script para importar presentes em lote.

## Rotas

### Publicas
- `/` - pagina inicial do evento
- `/presenca` - confirmacao de presenca
- `/rsvp` - alias que reaproveita a pagina de presenca
- `/gifts` - lista de presentes

### Admin
- `/admin/login` - login
- `/admin` - dashboard
- `/admin/gifts` - gerenciamento de presentes
- `/admin/guests` - convidados/RSVP

## Estrutura do projeto

```txt
src/
  app/
    page.tsx
    presenca/page.tsx
    rsvp/page.tsx
    gifts/
      page.tsx
      GiftsList.tsx
    admin/
      layout.tsx
      page.tsx
      login/page.tsx
      gifts/page.tsx
      guests/page.tsx
    CopyPix.tsx
    globals.css
  components/
    Navbar.tsx
    Petals.tsx
    Toast.tsx
  lib/
    supabase/
      client.ts
      server.ts
    types.ts
  proxy.ts
scripts/
  import-gifts.mjs
supabase_schema.sql
```

## Requisitos
- Node.js 18+
- Projeto no Supabase
- Usuario admin criado no Supabase Auth

## Configuracao do Supabase
1. Crie um projeto no Supabase.
2. Abra `SQL Editor` e execute o arquivo `supabase_schema.sql`.
3. Em `Authentication > Users`, crie um usuario admin (email/senha).
4. Em `Project Settings > API`, copie:
   - `Project URL`
   - `anon public key`
   - `service_role key` (usada apenas para importacao em lote)

## Variaveis de ambiente
Crie um arquivo `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

Para rodar o importador em lote, tambem defina a service role key no terminal:

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="SUA_SERVICE_ROLE_KEY"
```

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Scripts disponiveis
- `npm run dev` - ambiente de desenvolvimento
- `npm run build` - build de producao
- `npm run start` - servidor da build
- `npm run lint` - lint do projeto
- `npm run import:gifts` - importa presentes em lote no Supabase

## Importacao em lote de presentes
O script `scripts/import-gifts.mjs`:
- le `.env.local` automaticamente
- conecta no Supabase com `SUPABASE_SERVICE_ROLE_KEY`
- evita duplicados por nome (normalizado, sem acento/case)
- insere presentes com `status = disponivel`

Execucao:

```powershell
$env:SUPABASE_SERVICE_ROLE_KEY="SUA_SERVICE_ROLE_KEY"
npm run import:gifts
```

## Autenticacao e seguranca
- Rotas `/admin/*` sao protegidas em `src/proxy.ts`.
- Usuario nao autenticado em rota admin e redirecionado para `/admin/login`.
- Usuario autenticado em `/admin/login` e redirecionado para `/admin`.
- RLS habilitado em `convidados` e `presentes` no banco.

Resumo de politicas atuais (`supabase_schema.sql`):
- publico pode inserir e ler `convidados`
- publico pode ler e atualizar `presentes`
- usuario autenticado pode tudo em ambas as tabelas

## Dados do evento
As informacoes centrais do evento estao em:
- `src/lib/types.ts` (`EVENT_INFO`)

Campos:
- nome
- data
- horario
- local
- maps_url
- chave_pix

## Deploy (Vercel)
1. Suba o projeto para GitHub.
2. Importe o repositorio na Vercel.
3. Configure as variaveis:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## Troubleshooting
- `Invalid API key`
  - revise `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- erro de tabela inexistente
  - execute novamente `supabase_schema.sql`
- login admin nao funciona
  - confirme usuario em `Authentication > Users`
- importacao em lote falha com permissao
  - verifique `SUPABASE_SERVICE_ROLE_KEY` no terminal

## Observacoes
- A rota oficial para confirmacao de presenca esta em `/presenca`.
- `/rsvp` permanece como alias para compatibilidade.
