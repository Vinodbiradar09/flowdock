# Flowdock

A minimal task tracking and analytics platform built with Next.js 16, PostgreSQL, and Better Auth.

## Tech Stack
- **Framework** — Next.js 16 (App Router)
- **Database** — PostgreSQL + Prisma ORM
- **Auth** — Better Auth (Google OAuth)
- **UI** — shadcn/ui + Tailwind CSS v4
- **Validation** — Zod + React Hook Form


## Design Decisions

- **App Router + SSR** — All pages are server-rendered with data fetched at request time via internal API routes, ensuring session-aware rendering and no client waterfalls
- **Pattern B (API-first)** — Frontend always goes through `/api` route handlers instead of calling Prisma services directly, keeping a clean separation between frontend and backend
- **URL-based filters** — All task filters, search and pagination live in the URL via search params, making pages shareable and browser history friendly
- **Better Auth** — Google OAuth only, JWT sessions stored in httpOnly cookies with a 7-day expiry
- **Server Components by default** — Client components (`*.client.tsx`) are used only where browser APIs or interactivity is needed


## Setup Without Docker

### Prerequisites

- Node.js 20+
- PostgreSQL 16 running locally

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Vinodbiradar09/flowdock
cd flowdock
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/flowdock
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**4. Run database migrations**
```bash
npx prisma migrate dev
npx prisma generate
```

**5. Start the development server**
```bash
npm run dev
```

App is running at `http://localhost:3000`

---


## Setup With Docker

### Prerequisites

- Docker + Docker Compose

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Vinodbiradar09/flowdock
cd flowdock
```

**2. Configure environment variables**
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL=postgresql://flowdock:flowdock@db:5432/flowdock
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> Note: `DATABASE_URL` uses `db` as the host — this is the Docker Compose service name, not `localhost`

**3. Run database migrations**

Before starting the app, run migrations against the database container:
```bash
docker compose up db -d
npx prisma migrate deploy
```

**4. Start all services**
```bash
docker compose up --build
```

App is running at `http://localhost:3000`

**5. Stop all services**
```bash
docker compose down
```

To also remove the database volume:
```bash
docker compose down -v
```

---
