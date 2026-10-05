// Stubs for ESM-only NestJS packages that Jest (CJS mode) can't load directly.
// Mapped via moduleNameMapper in jest.config.js.

// ── @nestjs/jwt ──────────────────────────────────────────────────────────────
export class JwtService {
  sign = jest.fn();
  verify = jest.fn();
  decode = jest.fn();
  signAsync = jest.fn();
  verifyAsync = jest.fn();
}

// ── @nestjs/passport ─────────────────────────────────────────────────────────
// AuthGuard and PassportStrategy are only needed as base classes / DI tokens.
// Controller tests override JwtGuard entirely, so the real Passport logic never runs.
export const AuthGuard = (_strategy: string) =>
  class {
    canActivate() {
      return true;
    }
  };

export const PassportStrategy = (Strategy: new (...args: unknown[]) => unknown) => Strategy;
