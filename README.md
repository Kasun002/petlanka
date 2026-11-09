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
| Monorepo | Turborepo 2 + pnpm 10 workspaces |
| Backend | NestJS 10, TypeScript 5, Passport JWT |
| ORM | Prisma 7 (PostgreSQL, `@prisma/adapter-pg`) |
| Client frontend | React 19, Vite 8, Tailwind CSS 3, Axios, React Hook Form |
| Admin frontend | React 19, Vite 8, Tailwind CSS 3, Axios, React Hook Form |
| Shared types | `@petlanka/types` — auth interfaces, validation constants |
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
cp apps/backend/.env.example apps/backend/.env
cp apps/client/.env.example  apps/client/.env
cp apps/admin/.env.example   apps/admin/.env
# Defaults work out of the box for local dev — edit DATABASE_URL if your Postgres differs
```

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Run database migrations + generate client

```bash
pnpm --filter @petlanka/backend db:migrate    # prisma migrate dev
# Prisma 7 generates the client automatically after migrate
```

### 5. Seed the database

```bash
pnpm --filter @petlanka/backend db:seed
# Creates one SUPER_ADMIN: admin@petlanka.lk / changeme123!
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

### `apps/backend/.env`

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend port (default: `3000`) |
| `NODE_ENV` | `development` / `test` / `production` |
| `CORS_ORIGINS` | Comma-separated allowed FE origins (e.g. `http://localhost:5173,http://localhost:5174`) |
| `JWT_SECRET` | Access token signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret (min 32 chars) |
| `SEED_ADMIN_EMAIL` | Email for the seeded SUPER_ADMIN account |
| `SEED_ADMIN_PASSWORD` | Password for the seeded SUPER_ADMIN account |

### `apps/client/.env` + `apps/admin/.env`

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base URL (default: `http://localhost:3000/api`) |

### E2E (`tests/e2e/.env`)

| Variable | Description |
|----------|-------------|
| `E2E_BASE_URL` | Backend base URL for E2E tests |
| `E2E_CLIENT_URL` | Client app URL for E2E tests |
| `E2E_ADMIN_URL` | Admin app URL for E2E tests |

---

## Auth

### Client (OTP / passwordless)

```
POST /api/v1/client/auth/otp/request   { phone | email }         → OTP sent (console.log in dev)
POST /api/v1/client/auth/otp/verify    { phone | email, code }   → tokens + isNewUser flag
POST /api/v1/client/auth/register      (Bearer) { fullName, nic, province, district, city, streetAddress }
POST /api/v1/client/auth/refresh       { refreshToken }
POST /api/v1/client/auth/logout        (Bearer)
```

### Admin (email + password)

```
POST /api/v1/admin/auth/login    { email, password }   → tokens + admin profile
POST /api/v1/admin/auth/refresh  { refreshToken }
POST /api/v1/admin/auth/logout   (Bearer)
```

Default dev credentials (after seed): `admin@petlanka.lk` / `changeme123!`

### Token flow

- Access token: 15 min JWT, sent as `Authorization: Bearer <token>`
- Refresh token: stored hashed in PostgreSQL, rotated on every use
- FE stores tokens in `localStorage`; Axios interceptor attaches the Bearer header and auto-refreshes on 401

### CORS

Allowed origins come from `CORS_ORIGINS` in `apps/backend/.env`:

```
# local dev (default)
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# production
CORS_ORIGINS=https://petlanka.lk,https://admin.petlanka.lk
```

---

## Shared Package — `@petlanka/types`

Exports types and validation constants shared across backend DTOs and FE form validation:

```ts
// Auth response shapes
AuthTokens, OtpRequestResponse, OtpVerifyResponse, AdminLoginResponse, AuthenticatedUser, RoleName

// Validation (used in @Matches() decorators + React Hook Form rules)
NIC_REGEX, NIC_REGEX_MESSAGE          // 9 digits + V/X (old) or 12 digits (new)
SL_PHONE_REGEX, SL_PHONE_REGEX_MESSAGE  // +94XXXXXXXXX

// Router state
OtpIdentifierType, OtpVerifyRouteState
```

Vite dev servers resolve `@petlanka/types` from source (`src/index.ts`) via a Vite alias — no rebuild needed during development. After editing types for production build: `pnpm --filter @petlanka/types build`.

---

## Project Status

| Area | Status |
|------|--------|
| Monorepo scaffolding | ✅ Complete |
| Prisma schema + migrations (v7) | ✅ Complete |
| Backend auth — OTP + JWT + RBAC | ✅ Complete |
| Sri Lanka address validation (JSON) | ✅ Complete |
| Client FE auth screens + React Hook Form | ✅ Complete |
| Admin FE auth screen + React Hook Form | ✅ Complete |
| Shared validation constants (`@petlanka/types`) | ✅ Complete |
| CORS configuration | ✅ Complete |
| OTP delivery (real SMS/email provider) | ⬜ Pending |
| Rate limiting on `otp/request` | ⬜ Pending |
| `/me` endpoint (resolve user ID post-login) | ⬜ Pending |
| Logout UI in app shell | ⬜ Pending |
| E2E auth tests | ⬜ Pending |

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
