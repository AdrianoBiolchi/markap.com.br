# Markap — Precificação inteligente

> Descubra o preço ideal dos seus produtos e pare de deixar dinheiro na mesa.

## Stack
- Frontend: React + Tailwind CSS (Vite)
- Backend: Node.js + Express
- Banco: PostgreSQL + Prisma ORM
- Auth: JWT

## Desenvolvimento local

### Pré-requisitos
- Node.js 18+
- Docker (para o banco de dados)

### 1. Sobe o banco de dados
```bash
docker run --name markap-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=markap \
  -p 5432:5432 -d postgres:15
```

### 2. Configura as variáveis de ambiente
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Instala dependências e roda migrations
```bash
cd backend && npm install && npx prisma migrate dev
```

### 4. Sobe o projeto
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Acessa: http://localhost:5173

## Deploy

- **Frontend**: Vercel — conecta o repositório GitHub, pasta raiz `frontend`
- **Backend**: Railway — conecta o repositório GitHub, pasta raiz `backend`
- **Banco**: PostgreSQL no Railway (provisionar junto com o backend)
