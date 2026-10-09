# Auth Module — Implementation Plan

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
    decorators/
      current-user.decorator.ts # @CurrentUser() → req.user
      roles.decorator.ts        # @Roles(RoleName.ADMIN)

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

## Phase 1 — Prisma Schema

Add to `apps/backend/prisma/schema.prisma`:

```prisma
enum RoleName {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}

model User {
  id           String         @id @default(cuid())
  email        String?        @unique
  phone        String?        @unique
  firstName    String?
  lastName     String?
  isVerified   Boolean        @default(false)
  isActive     Boolean        @default(true)
  otpCodes     OtpCode[]
  refreshTokens RefreshToken[] @relation("UserRefreshTokens")
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@index([email])
  @@index([phone])
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

## Phase 2 — Shared Types (`packages/types/src/auth.ts`)

```typescript
// Exported from packages/types/src/index.ts — usable by FE + BE

export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

// JWT payload shape — validated by strategy, attached to req.user
export interface JwtPayload {
  sub: string;          // userId or adminId
  type: 'client' | 'admin';
  role?: RoleName;      // only for admin tokens
  iat?: number;
  exp?: number;
}

// Auth token pair returned to FE
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;    // seconds
}

// Client auth responses
export interface OtpRequestResponse {
  message: string;
  expiresInSeconds: number;
}

export interface OtpVerifyResponse extends AuthTokens {
  isNewUser: boolean;
}

// Admin auth response
export interface AdminLoginResponse extends AuthTokens {
  admin: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: RoleName;
  };
}

// Attached to request after JWT guard
export interface AuthenticatedUser {
  id: string;
  type: 'client' | 'admin';
  role?: RoleName;
}
```

---

## Phase 3 — DTOs

### Client DTOs

**`request-otp.dto.ts`**
```typescript
import { IsString, IsOptional, IsEmail, IsMobilePhone } from 'class-validator';

export class RequestOtpDto {
  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsMobilePhone()
  phone?: string;
  // validation: at least one required — handled in service
}
```

**`verify-otp.dto.ts`**
```typescript
export class VerifyOtpDto {
  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsMobilePhone()
  phone?: string;

  @IsString() @Length(6, 6)
  code: string;
}
```

**`register-client.dto.ts`**
```typescript
export class RegisterClientDto {
  @IsString() @MinLength(1)
  firstName: string;

  @IsString() @MinLength(1)
  lastName: string;
}
```

**`refresh-token.dto.ts`**
```typescript
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
```

### Admin DTOs

**`admin-login.dto.ts`**
```typescript
export class AdminLoginDto {
  @IsEmail()
  email: string;

  @IsString() @MinLength(8)
  password: string;
}
```

---

## Phase 4 — Auth Module (core)

### `auth.service.ts` — responsibilities

| Method | Purpose |
|--------|---------|
| `generateOtp(userId)` | Create 6-digit code, hash+store, return plaintext |
| `verifyOtp(identifier, code)` | Find active OTP, bcrypt compare, mark used |
| `issueTokens(sub, type, role?)` | Sign access + refresh JWT, store refresh hash |
| `refreshTokens(token)` | Verify refresh, rotate (revoke old, issue new) |
| `revokeRefreshToken(token)` | Set `revokedAt` |
| `validateAdmin(email, pass)` | Find admin, bcrypt compare password |

### `jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return { id: payload.sub, type: payload.type, role: payload.role };
  }
}
```

### `auth.module.ts`

```typescript
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    PassportModule,
    PrismaModule,
  ],
  providers: [AuthService, JwtStrategy, JwtGuard, RolesGuard],
  exports: [AuthService, JwtGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
```

---

## Phase 5 — Client Auth Controller

**Routes** (registered under `client.module.ts`):

```
POST /api/v1/client/auth/otp/request   — public
POST /api/v1/client/auth/otp/verify    — public
POST /api/v1/client/auth/register      — protected (unverified user completes profile)
POST /api/v1/client/auth/refresh       — public
POST /api/v1/client/auth/logout        — protected
```

**OTP flow logic:**
1. `otp/request`: find or create User by email/phone → generate OTP → send via notification (stub console.log for now) → return `{ message, expiresInSeconds: 300 }`
2. `otp/verify`: verify OTP → if valid, issue tokens → return `{ ...tokens, isNewUser: !user.firstName }`
3. `register`: JwtGuard required → update firstName/lastName on User → return updated user

**`client-auth.controller.ts` skeleton:**
```typescript
@Controller({ path: 'client/auth', version: '1' })
export class ClientAuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('otp/request')
  requestOtp(@Body() dto: RequestOtpDto): Promise<OtpRequestResponse> { ... }

  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto): Promise<OtpVerifyResponse> { ... }

  @Post('register')
  @UseGuards(JwtGuard)
  register(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterClientDto,
  ): Promise<...> { ... }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokens> { ... }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RefreshTokenDto,
  ): Promise<void> { ... }
}
```

---

## Phase 6 — Admin Auth Controller

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

## Phase 7 — RBAC

**`roles.decorator.ts`:**
```typescript
export const Roles = (...roles: RoleName[]) => SetMetadata('roles', roles);
```

**`roles.guard.ts`:**
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<RoleName[]>('roles', ctx.getHandler());
    if (!required?.length) return true;
    const user = ctx.switchToHttp().getRequest<Request>().user as AuthenticatedUser;
    return user.type === 'admin' && required.includes(user.role!);
  }
}
```

**Usage on protected admin routes:**
```typescript
@Get('users')
@UseGuards(JwtGuard, RolesGuard)
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
listUsers() { ... }
```

---

## Phase 8 — Seeding

File: `apps/backend/prisma/seed.ts`

```typescript
// Seed: creates one SUPER_ADMIN if none exists
async function main() {
  const existing = await prisma.admin.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });
  if (existing) return;

  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'changeme123!',
    10,
  );

  await prisma.admin.create({
    data: {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@petlanka.lk',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Seeded SUPER_ADMIN');
}
```

Add to `package.json` scripts (backend):
```json
"db:seed": "ts-node prisma/seed.ts"
```

Add to `schema.prisma`:
```prisma
generator client {
  // ...existing
}
// add:
// "prisma": { "seed": "ts-node prisma/seed.ts" }  ← in package.json
```

---

## Phase 9 — Environment Variables

Add to `apps/backend/.env.example`:
```
JWT_SECRET=change_me_in_production_min_32_chars
JWT_REFRESH_SECRET=change_me_refresh_min_32_chars
SEED_ADMIN_EMAIL=admin@petlanka.lk
SEED_ADMIN_PASSWORD=changeme123!
```

---

## Phase 10 — TDD Implementation Guide

### TDD Cycle (Red → Green → Refactor)

```
For every method and route:
  1. RED   — write the failing test first, run it, confirm it fails
  2. GREEN — write the minimum code to make it pass
  3. REFACTOR — clean up while tests stay green
```

**Run tests in watch mode during development:**
```bash
pnpm --filter @petlanka/backend test:watch
```

---

### Test Infrastructure Setup

**`apps/backend/src/test/prisma-mock.ts`** — shared Prisma mock factory:
```typescript
import { PrismaService } from '../prisma/prisma.service';

export const prismaMock = {
  user: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
  admin: { findUnique: jest.fn() },
  otpCode: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  refreshToken: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
  $transaction: jest.fn((cb) => cb(prismaMock)),
} satisfies Partial<PrismaService>;

export const prismaMockProvider = {
  provide: PrismaService,
  useValue: prismaMock,
};
```

**`apps/backend/src/test/jwt-mock.ts`** — JwtService mock:
```typescript
export const jwtMock = {
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn(),
};
export const jwtMockProvider = { provide: JwtService, useValue: jwtMock };
```

**`apps/backend/jest.config.ts`** — ensure spec files discovered:
```typescript
export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

---

### Phase 4-TDD — `auth.service.spec.ts` (write BEFORE auth.service.ts)

```typescript
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { prismaMock, prismaMockProvider } from '../test/prisma-mock';
import { jwtMock, jwtMockProvider } from '../test/jwt-mock';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, prismaMockProvider, jwtMockProvider],
    }).compile();
    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  // --- generateOtp ---
  describe('generateOtp', () => {
    it('returns a 6-digit numeric string', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      const code = await service.generateOtp('user-1');
      expect(code).toMatch(/^\d{6}$/);
    });

    it('stores a bcrypt hash, not plaintext', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      const code = await service.generateOtp('user-1');
      const stored = prismaMock.otpCode.create.mock.calls[0][0].data.code;
      expect(stored).not.toBe(code);
      expect(await bcrypt.compare(code, stored)).toBe(true);
    });

    it('sets expiresAt 5 minutes from now', async () => {
      prismaMock.otpCode.create.mockResolvedValue({});
      const before = Date.now();
      await service.generateOtp('user-1');
      const expiresAt: Date = prismaMock.otpCode.create.mock.calls[0][0].data.expiresAt;
      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(before + 4 * 60 * 1000);
      expect(expiresAt.getTime()).toBeLessThanOrEqual(before + 6 * 60 * 1000);
    });
  });

  // --- verifyOtp ---
  describe('verifyOtp', () => {
    const hash = bcrypt.hashSync('123456', 10);
    const validOtp = {
      id: 'otp-1',
      code: hash,
      expiresAt: new Date(Date.now() + 60_000),
      usedAt: null,
    };

    it('returns true and marks used for a valid code', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(validOtp);
      prismaMock.otpCode.update.mockResolvedValue({});
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(true);
      expect(prismaMock.otpCode.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'otp-1' } }),
      );
    });

    it('returns false for wrong code', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(validOtp);
      const result = await service.verifyOtp({ phone: '+94771234567' }, '000000');
      expect(result).toBe(false);
      expect(prismaMock.otpCode.update).not.toHaveBeenCalled();
    });

    it('returns false for expired OTP', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue({
        ...validOtp,
        expiresAt: new Date(Date.now() - 1000),
      });
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(false);
    });

    it('returns false for already-used OTP', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue({
        ...validOtp,
        usedAt: new Date(),
      });
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(false);
    });

    it('returns false when no OTP record found', async () => {
      prismaMock.otpCode.findFirst.mockResolvedValue(null);
      const result = await service.verifyOtp({ phone: '+94771234567' }, '123456');
      expect(result).toBe(false);
    });
  });

  // --- issueTokens ---
  describe('issueTokens', () => {
    it('returns accessToken and refreshToken strings', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      const tokens = await service.issueTokens('user-1', 'client');
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
    });

    it('stores a bcrypt hash of the refresh token, not plaintext', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      const tokens = await service.issueTokens('user-1', 'client');
      const storedHash = prismaMock.refreshToken.create.mock.calls[0][0].data.token;
      expect(storedHash).not.toBe(tokens.refreshToken);
      expect(await bcrypt.compare(tokens.refreshToken, storedHash)).toBe(true);
    });

    it('includes role in payload for admin tokens', async () => {
      prismaMock.refreshToken.create.mockResolvedValue({});
      await service.issueTokens('admin-1', 'admin', 'SUPER_ADMIN');
      const signCall = jwtMock.sign.mock.calls[0][0];
      expect(signCall).toMatchObject({ type: 'admin', role: 'SUPER_ADMIN' });
    });
  });

  // --- refreshTokens ---
  describe('refreshTokens', () => {
    it('issues new tokens and revokes the old refresh token', async () => {
      const storedHash = bcrypt.hashSync('old-token', 10);
      prismaMock.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1',
        token: storedHash,
        userId: 'user-1',
        adminId: null,
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: null,
      });
      prismaMock.refreshToken.update.mockResolvedValue({});
      prismaMock.refreshToken.create.mockResolvedValue({});

      const tokens = await service.refreshTokens('old-token');
      expect(tokens.accessToken).toBeTruthy();
      expect(prismaMock.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'rt-1' } }),
      );
    });

    it('throws UnauthorizedException for an expired refresh token', async () => {
      const storedHash = bcrypt.hashSync('old-token', 10);
      prismaMock.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1',
        token: storedHash,
        expiresAt: new Date(Date.now() - 1000),
        revokedAt: null,
      });
      await expect(service.refreshTokens('old-token')).rejects.toThrow('Unauthorized');
    });

    it('throws UnauthorizedException for a revoked refresh token', async () => {
      const storedHash = bcrypt.hashSync('old-token', 10);
      prismaMock.refreshToken.findFirst.mockResolvedValue({
        id: 'rt-1',
        token: storedHash,
        expiresAt: new Date(Date.now() + 60_000),
        revokedAt: new Date(),
      });
      await expect(service.refreshTokens('old-token')).rejects.toThrow('Unauthorized');
    });
  });

  // --- validateAdmin ---
  describe('validateAdmin', () => {
    const passwordHash = bcrypt.hashSync('correct-pass', 10);

    it('returns admin object on valid credentials', async () => {
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-1',
        email: 'admin@petlanka.lk',
        passwordHash,
        isActive: true,
        role: 'SUPER_ADMIN',
      });
      const result = await service.validateAdmin('admin@petlanka.lk', 'correct-pass');
      expect(result).not.toBeNull();
      expect(result!.id).toBe('admin-1');
    });

    it('returns null for wrong password', async () => {
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-1',
        passwordHash,
        isActive: true,
      });
      const result = await service.validateAdmin('admin@petlanka.lk', 'wrong-pass');
      expect(result).toBeNull();
    });

    it('returns null for non-existent email', async () => {
      prismaMock.admin.findUnique.mockResolvedValue(null);
      const result = await service.validateAdmin('nobody@petlanka.lk', 'any');
      expect(result).toBeNull();
    });

    it('returns null for inactive admin', async () => {
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-1',
        passwordHash,
        isActive: false,
      });
      const result = await service.validateAdmin('admin@petlanka.lk', 'correct-pass');
      expect(result).toBeNull();
    });
  });
});
```

---

### Phase 5-TDD — `client-auth.controller.spec.ts` (write BEFORE controller)

```typescript
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ClientAuthController } from './client-auth.controller';
import { AuthService } from '../../auth/auth.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';

const authServiceMock = {
  requestOtp: jest.fn(),
  verifyOtp: jest.fn(),
  issueTokens: jest.fn(),
  refreshTokens: jest.fn(),
  revokeRefreshToken: jest.fn(),
};

// Bypass JwtGuard in controller tests — guard is tested separately
const mockJwtGuard = { canActivate: jest.fn().mockReturnValue(true) };

describe('ClientAuthController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ClientAuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(() => app.close());
  afterEach(() => jest.clearAllMocks());

  // POST /client/auth/otp/request
  describe('POST /client/auth/otp/request', () => {
    it('returns 201 with message and expiresInSeconds', async () => {
      authServiceMock.requestOtp.mockResolvedValue({
        message: 'OTP sent',
        expiresInSeconds: 300,
      });
      const res = await request(app.getHttpServer())
        .post('/client/auth/otp/request')
        .send({ phone: '+94771234567' })
        .expect(201);
      expect(res.body).toMatchObject({ message: expect.any(String), expiresInSeconds: 300 });
    });

    it('returns 400 when neither email nor phone provided', () =>
      request(app.getHttpServer())
        .post('/client/auth/otp/request')
        .send({})
        .expect(400));
  });

  // POST /client/auth/otp/verify
  describe('POST /client/auth/otp/verify', () => {
    it('returns 201 with tokens and isNewUser flag', async () => {
      authServiceMock.verifyOtp.mockResolvedValue(true);
      authServiceMock.issueTokens.mockResolvedValue({
        accessToken: 'acc',
        refreshToken: 'ref',
        expiresIn: 900,
      });
      const res = await request(app.getHttpServer())
        .post('/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '123456' })
        .expect(201);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('isNewUser');
    });

    it('returns 401 for invalid OTP code', async () => {
      authServiceMock.verifyOtp.mockResolvedValue(false);
      await request(app.getHttpServer())
        .post('/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '000000' })
        .expect(401);
    });

    it('returns 400 for code not exactly 6 digits', () =>
      request(app.getHttpServer())
        .post('/client/auth/otp/verify')
        .send({ phone: '+94771234567', code: '12' })
        .expect(400));
  });

  // POST /client/auth/register
  describe('POST /client/auth/register', () => {
    it('returns 401 when JwtGuard blocks the request', async () => {
      mockJwtGuard.canActivate.mockReturnValueOnce(false);
      await request(app.getHttpServer())
        .post('/client/auth/register')
        .send({ firstName: 'Kasun', lastName: 'Dev' })
        .expect(403); // NestJS guard returns 403 by default
    });

    it('returns 201 with updated user when authenticated', async () => {
      authServiceMock.requestOtp.mockResolvedValue({
        id: 'user-1',
        firstName: 'Kasun',
        lastName: 'Dev',
      });
      // guard already returns true from mock
      await request(app.getHttpServer())
        .post('/client/auth/register')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send({ firstName: 'Kasun', lastName: 'Dev' })
        .expect(201);
    });
  });

  // POST /client/auth/refresh
  describe('POST /client/auth/refresh', () => {
    it('returns 201 with new tokens', async () => {
      authServiceMock.refreshTokens.mockResolvedValue({
        accessToken: 'new-acc',
        refreshToken: 'new-ref',
        expiresIn: 900,
      });
      const res = await request(app.getHttpServer())
        .post('/client/auth/refresh')
        .send({ refreshToken: 'old-token' })
        .expect(201);
      expect(res.body).toHaveProperty('accessToken', 'new-acc');
    });

    it('returns 401 for an invalid/expired refresh token', async () => {
      authServiceMock.refreshTokens.mockRejectedValue(
        new Error('Unauthorized'),
      );
      await request(app.getHttpServer())
        .post('/client/auth/refresh')
        .send({ refreshToken: 'bad-token' })
        .expect(401);
    });
  });

  // POST /client/auth/logout
  describe('POST /client/auth/logout', () => {
    it('returns 200 and revokes token when authenticated', async () => {
      authServiceMock.revokeRefreshToken.mockResolvedValue(undefined);
      await request(app.getHttpServer())
        .post('/client/auth/logout')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send({ refreshToken: 'some-token' })
        .expect(200);
      expect(authServiceMock.revokeRefreshToken).toHaveBeenCalled();
    });
  });
});
```

---

### Phase 6-TDD — `admin-auth.controller.spec.ts` (write BEFORE controller)

```typescript
describe('AdminAuthController (integration)', () => {
  // ... same app setup pattern as client controller spec ...

  // POST /admin/auth/login
  describe('POST /admin/auth/login', () => {
    it('returns 201 with tokens and admin data on valid credentials', async () => {
      authServiceMock.validateAdmin.mockResolvedValue({
        id: 'admin-1',
        email: 'admin@petlanka.lk',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
      });
      authServiceMock.issueTokens.mockResolvedValue({
        accessToken: 'acc',
        refreshToken: 'ref',
        expiresIn: 900,
      });
      const res = await request(app.getHttpServer())
        .post('/admin/auth/login')
        .send({ email: 'admin@petlanka.lk', password: 'correct-pass' })
        .expect(201);
      expect(res.body).toMatchObject({
        accessToken: expect.any(String),
        admin: { email: 'admin@petlanka.lk', role: 'SUPER_ADMIN' },
      });
    });

    it('returns 401 for wrong password', async () => {
      authServiceMock.validateAdmin.mockResolvedValue(null);
      await request(app.getHttpServer())
        .post('/admin/auth/login')
        .send({ email: 'admin@petlanka.lk', password: 'wrong' })
        .expect(401);
    });

    it('returns 400 for missing email', () =>
      request(app.getHttpServer())
        .post('/admin/auth/login')
        .send({ password: 'some-pass' })
        .expect(400));

    it('returns 400 for password shorter than 8 chars', () =>
      request(app.getHttpServer())
        .post('/admin/auth/login')
        .send({ email: 'admin@petlanka.lk', password: 'short' })
        .expect(400));
  });

  // POST /admin/auth/logout
  describe('POST /admin/auth/logout', () => {
    it('returns 401 without Bearer token', async () => {
      mockJwtGuard.canActivate.mockReturnValueOnce(false);
      await request(app.getHttpServer())
        .post('/admin/auth/logout')
        .send({ refreshToken: 'tok' })
        .expect(403);
    });

    it('returns 200 with valid token', async () => {
      authServiceMock.revokeRefreshToken.mockResolvedValue(undefined);
      await request(app.getHttpServer())
        .post('/admin/auth/logout')
        .set('Authorization', 'Bearer mock.jwt.token')
        .send({ refreshToken: 'tok' })
        .expect(200);
    });
  });
});
```

---

### Phase 7-TDD — `roles.guard.spec.ts` (write BEFORE guard)

```typescript
describe('RolesGuard', () => {
  it('allows access when no @Roles decorator is set', () => {
    // reflector returns undefined → guard returns true
  });

  it('allows SUPER_ADMIN to access SUPER_ADMIN|ADMIN protected route', () => {
    // user.role = 'SUPER_ADMIN', required = ['SUPER_ADMIN', 'ADMIN'] → true
  });

  it('blocks MODERATOR from SUPER_ADMIN|ADMIN protected route', () => {
    // user.role = 'MODERATOR', required = ['SUPER_ADMIN', 'ADMIN'] → false
  });

  it('blocks a client token from any admin-role route', () => {
    // user.type = 'client' → false regardless of required roles
  });
});
```

---

### TDD Execution Order (replaces original Execution Order)

```
For each phase below: write the spec → run (RED) → implement → run (GREEN) → refactor

PHASE 1  pnpm --filter @petlanka/backend add [deps]
PHASE 2  Edit schema.prisma → db:migrate → db:generate
PHASE 3  Write packages/types/src/auth.ts (types only, no logic → no tests needed)
PHASE 4  🔴 Write auth.service.spec.ts → run (all red)
         🟢 Implement auth.service.ts method by method until green
         ♻️  Refactor (extract helpers, tighten types)
PHASE 5  🔴 Write client-auth.controller.spec.ts → run (all red)
         🟢 Implement DTOs + ClientAuthController until green
         ♻️  Refactor
PHASE 6  🔴 Write admin-auth.controller.spec.ts → run (all red)
         🟢 Implement DTOs + AdminAuthController until green
         ♻️  Refactor
PHASE 7  🔴 Write roles.guard.spec.ts → run (all red)
         🟢 Implement RolesGuard + decorators until green
         ♻️  Refactor
PHASE 8  Wire modules: client.module.ts + admin.module.ts + app.module.ts
         Add ValidationPipe globally in main.ts (if not present)
PHASE 9  Write seed (Phase 8) + db:seed
PHASE 10 pnpm --filter @petlanka/backend test:cov
         Target: 100% coverage on auth.service.ts, guards, and controllers
```

**Coverage gate** — add to `jest.config.ts`:
```typescript
coverageThreshold: {
  './src/modules/auth/': { lines: 100, functions: 100, branches: 90 },
},
```

---

## Dependencies to Install

```bash
# Backend only
pnpm --filter @petlanka/backend add \
  @nestjs/passport @nestjs/jwt passport passport-jwt bcryptjs

pnpm --filter @petlanka/backend add -D \
  @types/passport-jwt @types/bcryptjs
```

`class-validator` and `class-transformer` — check if already installed (needed for DTO validation pipe).

---

## Execution Order

```
1. pnpm --filter @petlanka/backend add [deps above]
2. Edit schema.prisma (Phase 1)
3. pnpm --filter @petlanka/backend db:migrate  (name: add_auth_tables)
4. pnpm --filter @petlanka/backend db:generate
5. Edit packages/types/src/auth.ts (Phase 2) + re-export from index.ts
6. Build auth.module + auth.service + jwt.strategy + guards + decorators (Phase 3-4) — write tests first
7. Build client-auth.controller + DTOs (Phase 5)
8. Build admin-auth.controller + DTOs (Phase 6)
9. Wire into client.module.ts + admin.module.ts + app.module.ts
10. Add ValidationPipe globally in main.ts (if not present)
11. Write seed (Phase 8) + db:seed
12. Run tests: pnpm --filter @petlanka/backend test
```

---

## Deliberate Simplifications

- `ponytail:` OTP delivery is `console.log` in Phase 5 — replace with real SMS/email provider (Twilio, AWS SNS, Resend) when notification service exists
- `ponytail:` Refresh tokens stored in PostgreSQL — move to Redis for sub-millisecond revocation lookups at scale
- `ponytail:` Single JWT secret — add per-type secrets (client/admin) when security audit requires it
- `ponytail:` No rate limiting on OTP request endpoint — add `@nestjs/throttler` guard before going to production
