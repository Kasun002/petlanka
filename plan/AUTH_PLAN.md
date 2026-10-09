# Auth Module — Implementation Plan

> Legend: ✅ Done · ⬜ Pending

## Auth Mechanism (from Design.html)

| Boundary | Flow | Method |
|----------|------|--------|
| Client app | Phone/email → 6-digit OTP → register or login | OTP (passwordless) |
| Admin panel | Email + password → access | Credentials |
| Admin RBAC | Role assigned per admin user | JWT claims + guard |

Two separate user tables. Different token shapes. Same JWT strategy — `type` claim separates them.

---

## Module Structure

```
apps/backend/src/modules/
  auth/
    auth.module.ts              # exports JwtModule, guards, decorators
    auth.service.ts             # token issue/revoke, OTP gen/verify
    auth.service.spec.ts        # unit tests
    strategies/
      jwt.strategy.ts           # passport-jwt: validates both client+admin tokens
    guards/
      jwt.guard.ts              # extends AuthGuard('jwt')
      roles.guard.ts            # checks req.user.role against @Roles()
      roles.guard.spec.ts
    decorators/
      current-user.decorator.ts # @CurrentUser() → req.user
      roles.decorator.ts        # @Roles(RoleName.ADMIN)

  address/
    dto/
      address.dto.ts            # AddressDto + exported SriLankaAddressConstraint
    data/
      provinces.json            # 9 provinces (from SKIDDOW/SriLankaCitiesDatabase)
      districts.json            # 25 districts
      cities.json               # 2170 cities

  client/
    auth/
      client-auth.controller.ts
      client-auth.controller.spec.ts
      dto/
        request-otp.dto.ts
        verify-otp.dto.ts
        register-client.dto.ts
        refresh-token.dto.ts

  admin/
    auth/
      admin-auth.controller.ts
      admin-auth.controller.spec.ts
      dto/
        admin-login.dto.ts
        refresh-token.dto.ts

packages/types/src/
  auth.ts                       # shared FE+BE types
```

---

## Phase 1 — Prisma Schema ✅

Current `apps/backend/prisma/schema.prisma` (Prisma v7):

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  // url is NOT in schema — passed via PrismaPg adapter at runtime
}

enum RoleName {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}

model User {
  id            String         @id @default(cuid())
  email         String?        @unique
  phone         String?        @unique
  nic           String?        @unique   // Sri Lanka NIC (9+V/X or 12 digits)
  fullName      String?                  // single name field per Design.html
  province      String?
  district      String?
  city          String?
  streetAddress String?
  isVerified    Boolean        @default(false)
  isActive      Boolean        @default(true)
  otpCodes      OtpCode[]
  refreshTokens RefreshToken[] @relation("UserRefreshTokens")
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([email])
  @@index([phone])
  @@index([nic])
}

model OtpCode {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  code      String                    // stored as bcrypt hash
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([userId])
}

model Admin {
  id            String         @id @default(cuid())
  email         String         @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          RoleName       @default(ADMIN)
  isActive      Boolean        @default(true)
  refreshTokens RefreshToken[] @relation("AdminRefreshTokens")
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model RefreshToken {
  id        String    @id @default(cuid())
  token     String    @unique               // stored as bcrypt hash
  userId    String?
  adminId   String?
  user      User?     @relation("UserRefreshTokens", fields: [userId], references: [id], onDelete: Cascade)
  admin     Admin?    @relation("AdminRefreshTokens", fields: [adminId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime  @default(now())

  @@index([userId])
  @@index([adminId])
}
```

**Migration command:**
```bash
pnpm --filter @petlanka/backend db:migrate
# name: add_auth_tables
```

---

## Phase 2 — Shared Types (`packages/types/src/auth.ts`) ✅

```typescript
export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export interface JwtPayload {
  sub: string;          // userId or adminId
  type: 'client' | 'admin';
  role?: RoleName;      // only for admin tokens
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;    // seconds
}

export interface OtpRequestResponse {
  message: string;
  expiresInSeconds: number;
}

export interface OtpVerifyResponse extends AuthTokens {
  isNewUser: boolean;
}

export interface AdminLoginResponse extends AuthTokens {
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: RoleName;
  };
}

export interface AuthenticatedUser {
  id: string;
  type: 'client' | 'admin';
  role?: RoleName;
}
```

---

## Phase 3 — Address Module ✅

**`apps/backend/src/modules/address/dto/address.dto.ts`**

Validates province → district → city chain against bundled JSON data. `SriLankaAddressConstraint` is exported for reuse in `RegisterClientDto`.

```typescript
@ValidatorConstraint({ name: 'sriLankaAddress', async: false })
export class SriLankaAddressConstraint implements ValidatorConstraintInterface {
  validate(_, args): boolean {
    const obj = args.object as AddressDto;
    const province = provinces.find(p => p.name_en === obj.province);
    if (!province) return false;
    const district = districts.find(d => d.name_en === obj.district && d.province_id === province.id);
    if (!district) return false;
    return cities.some(c => c.name_en === obj.city && c.district_id === district.id);
  }
  defaultMessage() { return 'province, district, and city must be a valid Sri Lanka combination'; }
}

export class AddressDto {
  @IsString() @IsNotEmpty() declare province: string;
  @IsString() @IsNotEmpty() declare district: string;
  @IsString() @IsNotEmpty() @Validate(SriLankaAddressConstraint) declare city: string;
  @IsString() @IsNotEmpty() declare streetAddress: string;
}
```

---

## Phase 4 — DTOs ✅

### Client DTOs

**`request-otp.dto.ts`**
```typescript
export class RequestOtpDto {
  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsMobilePhone()
  phone?: string;

  @IsOptional()
  @Matches(/^(\d{9}[VXvx]|\d{12})$/, { message: 'invalid NIC format' })
  nic?: string;
}
```

**`verify-otp.dto.ts`**
```typescript
export class VerifyOtpDto {
  @IsOptional() @IsEmail()    declare email?: string;
  @IsOptional() @IsMobilePhone() declare phone?: string;
  @IsString() @Length(6, 6)  declare code: string;
}
```

**`register-client.dto.ts`** — all fields from Design.html Create account screen
```typescript
export class RegisterClientDto {
  @IsString() @MinLength(2)
  declare fullName: string;

  @Matches(/^(\d{9}[VXvx]|\d{12})$/, { message: 'invalid NIC format' })
  declare nic: string;

  @IsString() @IsNotEmpty() declare province: string;
  @IsString() @IsNotEmpty() declare district: string;
  @IsString() @IsNotEmpty() @Validate(SriLankaAddressConstraint) declare city: string;
  @IsString() @IsNotEmpty() declare streetAddress: string;
}
```

**`refresh-token.dto.ts`**
```typescript
export class RefreshTokenDto {
  @IsString() declare refreshToken: string;
}
```

### Admin DTOs

**`admin-login.dto.ts`**
```typescript
export class AdminLoginDto {
  @IsEmail()              declare email: string;
  @IsString() @MinLength(8) declare password: string;
}
```

---

## Phase 5 — Auth Module (core) ✅

### `auth.service.ts` — responsibilities

| Method | Purpose |
|--------|---------|
| `generateOtp(userId)` | Create 6-digit code, hash+store, return plaintext |
| `verifyOtp(identifier, code)` | Find active OTP via DB filter (usedAt null, expiresAt > now), bcrypt compare, mark used |
| `issueTokens(sub, type, role?)` | Sign access + refresh JWT, store refresh hash |
| `refreshTokens(token)` | Verify refresh, rotate (revoke old, issue new) |
| `revokeRefreshToken(token)` | Set `revokedAt` |
| `validateAdmin(email, pass)` | Find admin, bcrypt compare password |

> **Note:** expired/used OTP rejection is enforced entirely at the DB query level (`where: { usedAt: null, expiresAt: { gt: new Date() } }`). No application-level re-check needed.

### `jwt.strategy.ts` ✅

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, type: payload.type, role: payload.role };
  }
}
```

### `auth.module.ts` ✅

```typescript
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtGuard, RolesGuard],
  exports: [AuthService, JwtGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
```

---

## Phase 6 — Client Auth Controller ✅

**Routes:**

```
POST /api/v1/client/auth/otp/request   — public
POST /api/v1/client/auth/otp/verify    — public
POST /api/v1/client/auth/register      — protected (JWT required — new user completes profile)
POST /api/v1/client/auth/refresh       — public
POST /api/v1/client/auth/logout        — protected
```

**OTP flow logic:**
1. `otp/request`: find or create User by email/phone → generate OTP → deliver (console.log stub) → return `{ message, expiresInSeconds: 300 }`
2. `otp/verify`: verify OTP → issue tokens → return `{ ...tokens, isNewUser: !user.fullName }`
3. `register` (JWT-guarded): update `fullName`, `nic`, `province`, `district`, `city`, `streetAddress`, `isVerified: true` → return `{ id, fullName }`

---

## Phase 7 — Admin Auth Controller ✅

**Routes:**

```
POST /api/v1/admin/auth/login    — public
POST /api/v1/admin/auth/refresh  — public
POST /api/v1/admin/auth/logout   — protected
```

**Flow:**
1. `login`: `validateAdmin(email, password)` → issue tokens → return `AdminLoginResponse`
2. `refresh`: rotate tokens
3. `logout`: revoke refresh token

---

## Phase 8 — RBAC ✅

**`roles.decorator.ts`:**
```typescript
export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
```

**`roles.guard.ts`:** admin-only; checks `user.type === 'admin'` and role inclusion.

**Usage on protected admin routes:**
```typescript
@Get('users')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
listUsers() { ... }
```

---

## Phase 9 — Seeding ✅

File: `apps/backend/prisma/seed.ts`

```typescript
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const existing = await prisma.admin.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (existing) { console.log('SUPER_ADMIN already exists, skipping seed'); return; }

  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'changeme123!', 10);
  await prisma.admin.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@petlanka.lk',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });
}
```

---

## Phase 10 — Prisma v7 Migration ✅

Prisma upgraded from v6 → v7. Query API (`findMany`, `findFirst`, `create`, etc.) unchanged.

**Infrastructure changes:**

| Area | v6 | v7 |
|---|---|---|
| Generator provider | `prisma-client-js` | `prisma-client` |
| Generator output | (default `@prisma/client`) | `../generated/prisma` |
| `moduleFormat` | `"cjs"` | removed |
| Datasource `url` | in schema | removed from schema |
| DB connection | implicit | `PrismaPg` adapter passed to constructor |
| Import path | `@prisma/client` | `../../generated/prisma/client` |
| Adapter package | none | `@prisma/adapter-pg` |
| Jest transform | `(t\|j)s` | `ts` only (v7 emits `.js` in generated folder) |

**`prisma.service.ts` with adapter:**
```typescript
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
    super({ adapter });
  }
  async onModuleInit()  { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

> `process.env['DATABASE_URL']` is safe here because `ConfigModule.forRoot()` runs `dotenv.config()` synchronously before any provider constructors run.

---

## Phase 11 — Environment Variables ✅

`apps/backend/.env` (gitignored):
```
DATABASE_URL=postgresql://...
JWT_SECRET=change_me_in_production_min_32_chars
SEED_ADMIN_EMAIL=admin@petlanka.lk
SEED_ADMIN_PASSWORD=changeme123!
```

---

## Dependencies ✅

```bash
pnpm --filter @petlanka/backend add \
  @nestjs/passport @nestjs/jwt passport passport-jwt bcryptjs \
  @prisma/adapter-pg class-validator class-transformer

pnpm --filter @petlanka/backend add -D \
  @types/passport-jwt @types/bcryptjs prisma
```

Package versions (current):
- `prisma` / `@prisma/client`: `^7.0.0`
- `@prisma/adapter-pg`: `^7.0.0`

---

## Phase 12 — Shared Validation Constants ✅

Moved `NIC_REGEX` and added `SL_PHONE_REGEX` to `packages/types/src/validation.ts` so BE DTOs and FE form rules share a single source of truth.

**`packages/types/src/validation.ts`:**
```ts
export const NIC_REGEX = /^(\d{9}[VXvx]|\d{12})$/;
export const NIC_REGEX_MESSAGE = 'NIC must be 9 digits + V/X or 12 digits';
export const SL_PHONE_REGEX = /^\+94\d{9}$/;
export const SL_PHONE_REGEX_MESSAGE = 'Enter a valid Sri Lanka mobile number (+94XXXXXXXXX)';
export type OtpIdentifierType = 'phone' | 'email';
export interface OtpVerifyRouteState { identifier: string; type: OtpIdentifierType; }
```

BE DTOs updated to import from `@petlanka/types` instead of inlining the regex:
- `register-client.dto.ts` — `@Matches(NIC_REGEX, { message: NIC_REGEX_MESSAGE })`
- `request-otp.dto.ts` — same

---

## Phase 13 — CORS ✅

`apps/backend/src/main.ts`:
```ts
const corsOrigins = (process.env['CORS_ORIGINS'] ?? '').split(',').filter(Boolean);
app.enableCors({ origin: corsOrigins, credentials: true });
```

`apps/backend/.env`:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

For production set `CORS_ORIGINS` to real FE domains.

---

## Phase 14 — TypeScript Config Fix ✅

Prisma 7 generates the client into `apps/backend/generated/prisma/` which sits outside `src/`.

`tsconfig.json`:
```json
"include": ["src/**/*", "generated/**/*"]
```

`tsconfig.build.json` — removed explicit `rootDir: "./src"` so TypeScript infers the root from included directories.

---

## Pending Work ⬜

| # | Item |
|---|------|
| 1 | Replace OTP `console.log` stub with real SMS/email provider (Twilio, AWS SNS, or Resend) |
| 2 | Add `@nestjs/throttler` rate-limiting on `otp/request` before production |
| 3 | Add `/me` endpoint to return the authenticated user's full profile |
| 4 | Logout UI in the client and admin app shells |

---

## Deliberate Simplifications

- `ponytail:` OTP delivery is `console.log` — replace with real provider when notification service exists
- `ponytail:` Refresh tokens in PostgreSQL — move to Redis for O(1) revocation at scale
- `ponytail:` Single JWT secret — add per-type secrets when security audit requires it
- `ponytail:` `refreshTokens()` uses `findFirst` (no `jti`) — add UUID `jti` column + embed in JWT for O(1) multi-device token lookup
