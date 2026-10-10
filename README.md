# Taskline

Taskline is a task-management application with a React/Vite client and an
Express API server. Users can register, log in, manage tasks, filter
tasks by status, set due dates, and mark tasks as completed.

## Stack

- **Client:** React, TypeScript, Vite, Tailwind CSS
- **Server:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma
- **Authentication:** JWT access tokens 

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database

## Project structure

```text
client/   React/Vite frontend
server/   Express API, Prisma schema, and database migrations
```

## Installation

Install dependencies in both applications:

```bash
cd server
npm install

cd ../client
npm install
```

## Environment variables

### Server

Create `server/.env`:

```env
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_ACCESS_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-another-long-random-secret"
NODE_ENV=development
PORT=5000
```

`DATABASE_URL` is used by the application at runtime. `DIRECT_URL` is used
for Prisma migrations when your provider exposes separate pooled and direct
connections.

The API currently listens on port `5000`. Keep `CLIENT_URL` aligned with the
URL used by the Vite development server.

### Client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Database setup

From the `server` directory, generate the Prisma client and apply migrations:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
```

For local schema development, use:

```bash
npx prisma migrate dev --config prisma7.config.ts
```

Make sure PostgreSQL is running and the connection strings in `server/.env`
are valid before running migrations.

## Run locally

Start the API in one terminal:

```bash
cd server
npm run dev
```

Start the client in a second terminal:

```bash
cd client
npm run dev
```

Open the client at <http://localhost:5173>.

The API is available at <http://localhost:5000>.

## Available scripts

### Client

```bash
npm run dev        # Start the Vite development server
npm run typecheck  # Run TypeScript checks
npm run build      # Typecheck and create a production build
npm run preview    # Preview the production build
```

### Server

```bash
npm run dev        # Start the server
npm run typecheck  # Run TypeScript checks
```

## Main API areas

- `/api/auth` — registration, login, refresh, and logout
- `/api/tasks` — authenticated task creation, listing, updates, and deletion

The client sends credentials with requests so the refresh-token cookie can be
used to restore sessions and obtain new access tokens.
