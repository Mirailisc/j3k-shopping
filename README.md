# J3K Shopping Website

This project is part of CPE241 DATABASE SYSTEMS final project.

## Pre-requisites

- [Bun](https://bun.sh/)
- MySQL
- [Docker *optional*](https://www.docker.com/)

## Setup

### Env

Create `.env` file inside `frontend` and `backend`

for `backend`

```env
DATABASE_URL=mysql://root@localhost:3306/j3k
```

### Development

Install dependencies

```bash
bun install
```

Generate Database

```bash
cd backend && bun prisma db push
```

Generate types for Prisma

```bash
cd backend && bun prisma generate
```

Run Frontend

```bash
cd frontend && bun run dev
```

Run Backend

```bash
cd backend && bun run start:dev
```
