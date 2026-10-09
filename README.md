# Petlanka

Production-grade TypeScript monorepo — NestJS backend, React client, React admin.

## Architecture

```
petlanka/
├── apps/
│   ├── backend/          NestJS API (port 3000)
│   ├── client/           React + Vite client app (port 5173)
│   └── admin/            React + Vite admin app (port 5174)
├── packages/
│   ├── types/            Shared TypeScript types (API contracts)
│   ├── tsconfig/         Shared TypeScript configs (base, nestjs, react)
│   └── eslint-config/    Shared ESLint flat configs
├── tests/
│   └── e2e/              Playwright E2E tests
├── docker-compose.yml    PostgreSQL (dev + test containers)
└── .github/workflows/    CI pipeline
```

### API versioning

URI-based versioning via `VersioningType.URI`. All routes include the version in the path:

```
GET /api/v1/client/health    ← client boundary
GET /api/v1/admin/health     ← admin boundary
```

Admin and client concerns are separated at the module/controller level. Each has independent authorization boundaries (to be implemented), and each can be extracted into its own service later.

### Future AI service

The repository is structured to accommodate an `apps/ai-service/` directory without restructuring. Shared types and API contracts live in `packages/types/`. The backend module system allows adding an `AiModule` without touching existing modules.

---

## Technology stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Backend | NestJS 11, TypeScript 5 |
| ORM | Prisma 6 (PostgreSQL) |
| Client frontend | React 19, Vite 8, Tailwind CSS 3, Axios |
| Admin frontend | React 19, Vite 8, Tailwind CSS 3, Axios |
| Backend tests | Jest 29 + Supertest |
| Frontend tests | Vitest 3 + Testing Library |
| E2E tests | Playwright 1.49 |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier 3 |
| CI | GitHub Actions |

---

## Development setup

### Prerequisites

- Node.js 22+ (see `.nvmrc`)
- pnpm 10+: `npm i -g pnpm`
- Docker (for PostgreSQL)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env if needed — defaults work with Docker Compose
cp apps/backend/.env.example apps/backend/.env
cp apps/client/.env.example apps/client/.env
cp apps/admin/.env.example apps/admin/.env
```

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Run database migrations

```bash
pnpm --filter @petlanka/backend db:migrate
```

### 5. Generate Prisma client

```bash
pnpm --filter @petlanka/backend db:generate
```

### 6. Seed the database (creates SUPER_ADMIN)

```bash
pnpm --filter @petlanka/backend db:seed
```

---

## Running applications

Start all apps in development mode:

```bash
pnpm dev
```

Or start individually:

```bash
pnpm --filter @petlanka/backend dev    # http://localhost:3000
pnpm --filter @petlanka/client dev     # http://localhost:5173
pnpm --filter @petlanka/admin dev      # http://localhost:5174
```

---

## Commands

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev                              # all apps
pnpm --filter @petlanka/backend dev   # backend only
pnpm --filter @petlanka/client dev    # client only
pnpm --filter @petlanka/admin dev     # admin only
```

### Build

```bash
pnpm build                            # all apps
pnpm --filter @petlanka/backend build
pnpm --filter @petlanka/client build
pnpm --filter @petlanka/admin build
```

### Typecheck

```bash
pnpm typecheck
```

### Lint

```bash
pnpm lint
pnpm lint:fix
```

### Format

```bash
pnpm format
pnpm format:check
```

### Tests

```bash
pnpm test:unit               # all unit tests
pnpm test:integration        # backend integration tests (requires PostgreSQL)
pnpm test:e2e                # Playwright E2E tests (requires all apps running)
```

### E2E

```bash
# Install Playwright browsers (first time)
pnpm --filter @petlanka/e2e install-browsers

# Run E2E tests
pnpm test:e2e

# Interactive Playwright UI
pnpm --filter @petlanka/e2e test:ui
```

---

## Environment configuration

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend port (default: 3000) |
| `NODE_ENV` | `development` / `test` / `production` |
| `JWT_SECRET` | Access token signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret (min 32 chars) |
| `SEED_ADMIN_EMAIL` | Email for the seeded SUPER_ADMIN account |
| `SEED_ADMIN_PASSWORD` | Password for the seeded SUPER_ADMIN account |
| `VITE_API_BASE_URL` | API base URL used by frontend apps |
| `E2E_BASE_URL` | Backend base URL for E2E tests |
| `E2E_CLIENT_URL` | Client app URL for E2E tests |
| `E2E_ADMIN_URL` | Admin app URL for E2E tests |

---

## Monorepo conventions

- Packages use `@petlanka/` scope
- Internal packages use `workspace:*` as version
- Shared config lives in `packages/` — apps never duplicate config
- Each app has independent `typecheck`, `build`, `test`, `lint` scripts
- Turborepo orchestrates task dependencies and caching

---

## API versioning strategy

URI versioning (`/api/v1/...`) is configured in `apps/backend/src/main.ts`. To add v2:

1. Create new controllers with `@Controller({ path: '...', version: '2' })`
2. Register them in the appropriate module
3. v1 remains unaffected

---

## Future microservice strategy

The backend module structure maps cleanly to future services:

```
apps/
  backend/
    src/modules/
      auth/      → future: common service (client, admin, ai)
      client/    → future: client-service
      admin/     → future: admin-service
      ai/        → future: ai-service
```

Extract a module to a service by:
1. Moving the module directory to `apps/<service-name>/`
2. Replacing direct imports with HTTP/message-broker calls
3. Wiring up an API gateway if needed

---

## Future AI integration

Add AI capability without restructuring:

```
apps/
  ai-service/           New NestJS or standalone service
packages/
  types/
    src/ai.ts           Add AI-specific shared types here
```

The existing module system, shared types package, and Docker Compose infrastructure accommodate this without changes to existing apps.
