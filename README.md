# J3K Shopping Website

This project is part of CPE241 DATABASE SYSTEMS final project.

## Pre-requisites

- [Bun](https://bun.sh/)
- MySQL
- [Docker *optional*](https://www.docker.com/)

## Setup

### Env

Create `.env` file inside backend folder

```env
DATABASE_URL=mysql://<your_database_user>:<your_database_password>@localhost:3306/j3k
STRIPE_API_KEY= บอก กู เจ้าของ repo
```

### Development

First, you need to install dependencies in both `frontend` and `backend` by running this command

```bash
bun install
```

and you need to run this command to create database and its tables

> You must create `.env` in backend folder before running this command

```bash
cd backend && bun prisma db push
```

then you need to generate types for Prisma

```bash
cd backend && bun prisma generate
```

Finally, you can run project in development mode by typing these commands.

run frontend

```bash
cd frontend && bun run dev
```

run backend

```bash
cd backend && bun run start:dev
```
