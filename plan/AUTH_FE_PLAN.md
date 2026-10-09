# Auth Frontend — Implementation Plan

> Legend: ✅ Done · ⬜ Pending

## Scope

Frontend auth only for both apps. No state management library — React context + localStorage.
Backend auth is complete (see `AUTH_PLAN.md`).

---

## Screens

| App | Screen | Route | Status |
|-----|--------|-------|--------|
| client | Welcome | `/` | ✅ |
| client | Login (OTP request) | `/login` | ✅ |
| client | OTP Verify | `/login/verify` | ✅ |
| client | Create Account (register) | `/register` | ✅ |
| admin | Login | `/login` | ✅ |

---

## Design Tokens

From Design.html:

```
client bg:     #FAF8F3  (cream) → Tailwind: bg-surface
primary green: #0F7A63          → Tailwind: bg-primary / text-primary
admin accent:  #0A5C49          → Tailwind: bg-primary-dark
```

Added to both `apps/client/tailwind.config.js` and `apps/admin/tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: '#0F7A63',
      'primary-dark': '#0A5C49',
      surface: '#FAF8F3',
    },
  },
},
```

---

## Shared Types

`@petlanka/types` already exports everything needed — no new package required:

- `AuthTokens`, `OtpRequestResponse`, `OtpVerifyResponse`, `AdminLoginResponse`
- `AuthenticatedUser`, `RoleName`

---

## Address Data

Sri Lanka provinces/districts/cities JSON copied from:
`apps/backend/src/modules/address/data/` → `apps/client/src/data/address/`

Backend keeps its own copy. Only the client app has address fields (admin does not).
Static import in `AddressFields.tsx` — no API round-trip for static reference data.

---

## File Layout

```
apps/client/src/
  context/
    AuthContext.tsx              ✅  AuthenticatedUser | null + setAuth, clearAuth
  services/api/
    client.ts                       existing Axios instance (unchanged)
    auth.ts                     ✅  requestOtp, verifyOtp, registerClient, refreshTokens, logout
  interceptors/
    auth.interceptor.ts         ✅  Bearer attach + 401 → refresh → retry
  components/auth/
    OtpInput.tsx                ✅  6-box OTP input, auto-advance + backspace nav
    PhoneInput.tsx              ✅  +94 prefix phone field
    AddressFields.tsx           ✅  Province → District → City cascade + street address
    TermsCheckbox.tsx           ✅  Terms & conditions checkbox
  data/address/
    provinces.json              ✅  9 provinces (copied from backend)
    districts.json              ✅  25 districts
    cities.json                 ✅  2170 cities
  pages/auth/
    WelcomePage.tsx             ✅
    LoginPage.tsx               ✅
    OtpVerifyPage.tsx           ✅
    RegisterPage.tsx            ✅
  routes/
    AuthRoute.tsx               ✅  redirect to /login if unauthenticated
    GuestRoute.tsx              ✅  redirect to / if already authenticated
  app/App.tsx                   ✅  updated with auth routes
  main.tsx                      ✅  AuthProvider + setupInterceptors()

apps/admin/src/
  context/
    AuthContext.tsx             ✅  same shape as client
  services/api/
    client.ts                       existing Axios instance (unchanged)
    auth.ts                    ✅  adminLogin, refreshTokens, logout
  interceptors/
    auth.interceptor.ts        ✅  same pattern as client
  components/auth/
    PasswordInput.tsx          ✅  show/hide toggle
  pages/auth/
    LoginPage.tsx              ✅  dark teal header, email + password
  routes/
    AuthRoute.tsx              ✅
    GuestRoute.tsx             ✅
  app/App.tsx                  ✅  updated with auth routes
  main.tsx                     ✅  AuthProvider + setupInterceptors()
```

---

## AuthContext

Same implementation in both apps.

```tsx
// context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import type { AuthenticatedUser } from '@petlanka/types';

interface AuthCtx {
  user: AuthenticatedUser | null;
  setAuth: (user: AuthenticatedUser, tokens: { accessToken: string; refreshToken: string }) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthenticatedUser) : null;
  });

  const setAuth = (u: AuthenticatedUser, tokens: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const clearAuth = () => {
    ['accessToken', 'refreshToken', 'user'].forEach((k) => localStorage.removeItem(k));
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setAuth, clearAuth }}>{children}</AuthContext.Provider>;
}
```

> `ponytail:` localStorage for tokens — move to httpOnly cookies when a security audit requires it.

---

## Axios Interceptor

Same implementation in both apps. Called once via `setupInterceptors()` in `main.tsx` before render.

```ts
// interceptors/auth.interceptor.ts
import apiClient from '../services/api/client';
import { refreshTokens } from '../services/api/auth';

// ponytail: single promise guard — replace with a queue if multi-tab token sync needed
let refreshing: Promise<string> | null = null;

export function setupInterceptors(): void {
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  apiClient.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config;
      if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
      original._retry = true;
      const storedRefresh = localStorage.getItem('refreshToken');
      if (!storedRefresh) return Promise.reject(error);
      refreshing ??= refreshTokens(storedRefresh).then((t) => {
        localStorage.setItem('accessToken', t.accessToken);
        localStorage.setItem('refreshToken', t.refreshToken);
        refreshing = null;
        return t.accessToken;
      });
      const token = await refreshing;
      original.headers.Authorization = `Bearer ${token}`;
      return apiClient.request(original);
    },
  );
}
```

---

## API Service Layer

### `apps/client/src/services/api/auth.ts`

```ts
import type { OtpRequestResponse, OtpVerifyResponse, AuthTokens } from '@petlanka/types';
import api from './client';

export const requestOtp = (body: { email?: string; phone?: string; nic?: string }) =>
  api.post<OtpRequestResponse>('/v1/client/auth/otp/request', body).then((r) => r.data);

export const verifyOtp = (body: { email?: string; phone?: string; code: string }) =>
  api.post<OtpVerifyResponse>('/v1/client/auth/otp/verify', body).then((r) => r.data);

export const registerClient = (body: {
  fullName: string; nic: string;
  province: string; district: string; city: string; streetAddress: string;
}) => api.post<{ id: string; fullName: string | null }>('/v1/client/auth/register', body).then((r) => r.data);

export const refreshTokens = (refreshToken: string) =>
  api.post<AuthTokens>('/v1/client/auth/refresh', { refreshToken }).then((r) => r.data);

export const logout = (refreshToken: string) =>
  api.post('/v1/client/auth/logout', { refreshToken });
```

### `apps/admin/src/services/api/auth.ts`

```ts
import type { AdminLoginResponse, AuthTokens } from '@petlanka/types';
import api from './client';

export const adminLogin = (body: { email: string; password: string }) =>
  api.post<AdminLoginResponse>('/v1/admin/auth/login', body).then((r) => r.data);

export const refreshTokens = (refreshToken: string) =>
  api.post<AuthTokens>('/v1/admin/auth/refresh', { refreshToken }).then((r) => r.data);

export const logout = (refreshToken: string) =>
  api.post('/v1/admin/auth/logout', { refreshToken });
```

---

## Components

### `OtpInput.tsx` (client)
- 6 `<input maxLength={1}>` boxes in a flex row
- Auto-advance on digit entry; backspace moves focus to previous box
- Props: `value: string; onChange: (v: string) => void`

### `PhoneInput.tsx` (client)
- Fixed `+94` prefix label + number input
- Emits full `+94XXXXXXXXX` string to parent; strips prefix for display

### `AddressFields.tsx` (client)
- Province → District → City cascade selects (filtered from static JSON)
- Street address text input
- Resetting parent selection clears child selections
- Props: `value: AddressValue; onChange: (v: AddressValue) => void`

### `TermsCheckbox.tsx` (client)
- Checkbox with links to `/terms` and `/privacy`
- Props: `checked: boolean; onChange: () => void`

### `PasswordInput.tsx` (admin)
- Password input with eye icon show/hide toggle
- Props: `value: string; onChange: (v: string) => void`

---

## Client Screens

### WelcomePage (`/`)
- Cream (`bg-surface`) background
- Logo placeholder, tagline
- Two CTAs: "Login" and "Sign Up" → both navigate to `/login` (OTP flow determines new vs returning)

### LoginPage (`/login`)
- Toggle between Phone / Email identifier (`OtpIdentifierType` from `@petlanka/types`)
- `PhoneInput` (via RHF `Controller`) or plain email `<input>` based on toggle
- RHF validates phone with `SL_PHONE_REGEX` / email with pattern rule
- Type toggle calls `reset()` to clear the inactive field and its errors
- Submit → `requestOtp()` → navigate to `/login/verify` with `OtpVerifyRouteState` in `location.state`

### OtpVerifyPage (`/login/verify`)
- Reads `OtpVerifyRouteState` from `location.state`; redirects to `/login` if missing
- `OtpInput` wrapped in RHF `Controller`, validates `minLength: 6`
- Submit → `verifyOtp()` → `setAuth()` → `isNewUser ? '/register' : '/'`
- Resend button with 60s cooldown (local `useState`, no backend change)

### RegisterPage (`/register`) — behind `AuthRoute`
- RHF `useForm<RegisterForm>` — fields: `fullName`, `nic`, `phone`, `address`, `terms`
- `NIC_REGEX` from `@petlanka/types` used in RHF `pattern` rule
- `PhoneInput`, `AddressFields`, `TermsCheckbox` each wrapped in `Controller`
- `AddressFields` validated via single `validate` fn (province → district → city → street)
- API errors written to `errors.root` via `setError('root', ...)`
- Submit → `registerClient()` → navigate to `/`

---

## Admin Screen

### LoginPage (`/login`)
- Dark teal header bar (`bg-primary-dark`), logo text
- RHF `useForm<AdminLoginForm>` — `email` (pattern rule) + `password` (minLength 8)
- `PasswordInput` wrapped in `Controller`
- API errors written to `errors.root` via `setError('root', ...)`
- Submit → `adminLogin()` → `setAuth({ id, type:'admin', role }, tokens)` → navigate to `/`
- Centered card layout (`max-w-md mx-auto`)

---

## Route Guards

```tsx
// AuthRoute — redirect to /login if unauthenticated
export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// GuestRoute — redirect to / if already authenticated
export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}
```

---

## Router Wiring

### `apps/client/src/app/App.tsx`

```tsx
<Routes>
  <Route path="/"             element={<GuestRoute><WelcomePage /></GuestRoute>} />
  <Route path="/login"        element={<GuestRoute><LoginPage /></GuestRoute>} />
  <Route path="/login/verify" element={<GuestRoute><OtpVerifyPage /></GuestRoute>} />
  <Route path="/register"     element={<AuthRoute><RegisterPage /></AuthRoute>} />
  <Route element={<MainLayout />}>
    <Route path="/home" element={<AuthRoute><HomePage /></AuthRoute>} />
  </Route>
</Routes>
```

### `apps/admin/src/app/App.tsx`

```tsx
<Routes>
  <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
  <Route element={<MainLayout />}>
    <Route path="/" element={<AuthRoute><DashboardPage /></AuthRoute>} />
  </Route>
</Routes>
```

---

## Responsive Breakpoints (client only)

| Breakpoint | Behaviour |
|------------|-----------|
| Base (390px) | Full-width stacked layout, single-column fields |
| `md:` (768px) | Centered `max-w-sm` card, side padding |

Admin is desktop-only: `max-w-md mx-auto` card centered in full viewport.

---

## SOLID Alignment

| Principle | Applied |
|-----------|---------|
| S | Each component has one job: `OtpInput` handles input, `AddressFields` handles cascade |
| O | `AuthProvider` open to adding profile fields without touching consumers |
| L | `AuthRoute`/`GuestRoute` interchangeable without breaking route tree |
| I | API split: `auth.ts` for auth calls only, not mixed with other resources |
| D | Components depend on `useAuth()` hook, not `localStorage` directly |

---

## React Hook Form Integration ✅

`react-hook-form` installed in both apps. All form pages refactored.

### Pattern

```tsx
const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } =
  useForm<FormType>({ defaultValues: {...} });
```

- Plain `<input>` fields use `{...register('field', rules)}`
- Custom inputs (`PhoneInput`, `OtpInput`, `AddressFields`, `TermsCheckbox`, `PasswordInput`) use `<Controller>`
- API errors use `setError('root', { message: '...' })` → rendered via `errors.root?.message`
- `isSubmitting` replaces the manual `loading` state — no more `useState` for form state

### `FormField` wrapper

Both apps have `src/components/ui/FormField.tsx`:

```tsx
export default function FormField({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
```

Wraps every field; renders `errors.field.message` below the input.

---

## Shared Validation Constants ✅

`packages/types/src/validation.ts` exports `NIC_REGEX`, `NIC_REGEX_MESSAGE`, `SL_PHONE_REGEX`, `SL_PHONE_REGEX_MESSAGE`, `OtpIdentifierType`, `OtpVerifyRouteState`. Used in:

- **BE**: `@Matches(NIC_REGEX)` in `register-client.dto.ts` and `request-otp.dto.ts`
- **FE**: `pattern: { value: NIC_REGEX }` and `validate: (v) => SL_PHONE_REGEX.test(v)` in RHF rules

---

## Vite Alias Fix ✅

`packages/types` compiles to CJS (`module: "commonjs"`). Vite serves ESM — runtime values (regex constants) in CJS format cause `SyntaxError: does not provide an export named` in the browser.

Fix: both `vite.config.js` / `vite.config.ts` alias `@petlanka/types` to the TypeScript source:

```js
'@petlanka/types': resolve(__dirname, '../../packages/types/src/index.ts')
```

Vite compiles the source as ESM directly. No rebuild needed in dev. Matches the existing Jest `moduleNameMapper`.

---

## CORS ✅

`apps/backend/src/main.ts`:
```ts
const corsOrigins = (process.env['CORS_ORIGINS'] ?? '').split(',').filter(Boolean);
app.enableCors({ origin: corsOrigins, credentials: true });
```

`apps/backend/.env`:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

---

## Deliberate Simplifications

- `ponytail:` localStorage for tokens — move to httpOnly cookies when security audit requires it
- `ponytail:` single in-flight refresh guard (`refreshing` promise variable) — replace with a queue if multi-tab token sync is needed
- `ponytail:` address JSON copied to `apps/client/src/data/address/` — avoids a `pnpm build` dependency on `@petlanka/types` before the Vite dev server starts
- `ponytail:` `AuthenticatedUser.id` is `''` after OTP verify — add a `/me` endpoint when user profile is needed

---

## Pending Work

| # | Item |
|---|------|
| 1 | Replace OTP `console.log` stub with real SMS/email provider (Twilio, AWS SNS, or Resend) |
| 2 | Logout UI — button in app shell that calls `logout()` + `clearAuth()` |
| 3 | `/me` endpoint — resolve `AuthenticatedUser.id` post-login without decoding JWT client-side |
| 4 | Admin role-based UI gating (hide/show features based on `user.role`) |

---

## Verification

1. `pnpm --filter @petlanka/client dev` → `http://localhost:5173` shows WelcomePage (cream bg)
2. Click Login → LoginPage; enter phone → OTP request → backend `console.log` shows OTP code
3. Enter OTP → tokens in localStorage, redirect to `/register` (new user) or `/` (returning)
4. Fill register form → `POST /api/v1/client/auth/register` → redirect to `/`
5. Refresh page → stays logged in (Axios interceptor re-attaches access token)
6. `pnpm --filter @petlanka/admin dev` → `http://localhost:5174/login` → seeded credentials → dashboard
7. `pnpm --filter @petlanka/client test` and `pnpm --filter @petlanka/admin test` → pass
