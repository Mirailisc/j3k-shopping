# J3K Shopping Website

This project is part of CPE241 DATABASE SYSTEMS final project.

## Pre-requisites

- Node.js with pnpm installed
- MySQL
- Docker *optional*

## Setup

### Env

Create `.env` file inside `frontend` and `backend`

for `frontend`

```env
VITE_API_URL=http://localhost:3000
```

for `backend`

```env
DATABASE_URL=mysql://root@localhost:3306/j3k
```

### Development

Install dependencies

```bash
pnpm install
```

Generate Database

```bash
cd backend && pnpx prisma db push
```

Generate types for Prisma

```bash
cd backend && pnpx prisma generate
```

```bash
pnpm dev
```
