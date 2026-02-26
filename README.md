# 🎉 Chá de Panela — Gustavo & Rebeca
## Guia Completo de Deploy

---

## 📋 Pré-requisitos
- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuito)
- Conta na [Vercel](https://vercel.com) (gratuito)
- Conta no [GitHub](https://github.com) (gratuito)

---

## PASSO 1 — Configurar o Supabase

### 1.1 Criar o projeto
1. Acesse supabase.com → **New Project**
2. Nome: `cha-de-panela`, escolha uma senha forte
3. Região: **South America (São Paulo)**
4. Clique em **Create** e aguarde ~2 minutos

### 1.2 Criar as tabelas
1. Menu lateral → **SQL Editor → New query**
2. Cole todo o conteúdo do arquivo `supabase_schema.sql`
3. Clique em **Run** ▶️ — verá `Success. No rows returned`

### 1.3 Criar o usuário admin
1. Menu lateral → **Authentication → Users**
2. **Add user → Create new user**
3. Preencha seu email e uma senha forte → **Create user**

> ⚠️ Guarde esses dados — são o login do painel /admin

### 1.4 Pegar as credenciais da API
1. Menu lateral → **Project Settings → API**
2. Copie: **Project URL** e a chave **anon public** (começa com `eyJ...`)

---

## PASSO 2 — Testar localmente (opcional)

```bash
# Instalar dependências
npm install

# Criar e editar o arquivo de variáveis
cp .env.local.example .env.local
# Preencha com sua URL e chave do Supabase

# Rodar
npm run dev
# Acesse: http://localhost:3000
```

---

## PASSO 3 — Subir no GitHub

```bash
git init
git add .
git commit -m "chore: initial commit"

# Crie um repositório PRIVADO no GitHub, depois:
git remote add origin https://github.com/SEU_USUARIO/cha-de-panela.git
git branch -M main
git push -u origin main
```

---

## PASSO 4 — Deploy na Vercel

### 4.1 Importar o projeto
1. vercel.com → **Add New → Project**
2. **Import Git Repository** → selecione `cha-de-panela`
3. Clique em **Import**

### 4.2 Variáveis de ambiente
Antes de fazer deploy, adicione em **Environment Variables**:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

### 4.3 Fazer o deploy
1. Clique em **Deploy** e aguarde ~2 minutos
2. 🎉 Seu site estará em: `https://cha-de-panela.vercel.app`

> A cada `git push`, a Vercel faz o redeploy automático!

---

## PASSO 5 — Domínio personalizado (opcional)

Quer uma URL como `charebecaegustavo.com.br`?
1. Compre um domínio no Registro.br (~R$40/ano)
2. Vercel → **Settings → Domains → Add Domain**
3. Siga as instruções de DNS

---

## 🗺️ Mapa de páginas

| URL | Quem acessa | Descrição |
|-----|-------------|-----------|
| `/` | Todos | Página principal do evento |
| `/rsvp` | Todos | Confirmar presença |
| `/gifts` | Todos | Lista de presentes |
| `/admin/login` | Você | Login do painel |
| `/admin` | Você | Dashboard |
| `/admin/gifts` | Você | Gerenciar presentes |
| `/admin/guests` | Você | Ver convidados |

---

## 🔐 Primeiro acesso ao Admin

1. Acesse `sua-url.vercel.app/admin/login`
2. Use o email e senha do Passo 1.3
3. Vá em **Presentes** para cadastrar os itens da lista

---

## ❓ Problemas comuns

| Erro | Solução |
|------|---------|
| "Invalid API key" | Verifique a `ANON_KEY` nas variáveis da Vercel |
| "relation does not exist" | Execute o SQL do `supabase_schema.sql` novamente |
| Login não funciona | Confirme o usuário em Authentication → Users no Supabase |

---

## 💰 Custo total: R$ 0,00

Supabase + Vercel + GitHub são **100% gratuitos** para esse volume de uso!
