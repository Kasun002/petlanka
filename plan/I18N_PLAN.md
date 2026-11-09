# i18n Localization Plan — PetLanka

**Apps:** `apps/client` + `apps/admin`
**Locales:** `en` (default), `si` (Sinhala), `ta` (Tamil)
**Strategy:** Shared translation package (`@petlanka/i18n`) + per-app i18next init
**Admin:** English-first — Sinhala/Tamil as secondary, switcher present but optional

---

## Overview

| Item | Choice |
|------|--------|
| Library | `i18next` + `react-i18next` + `i18next-browser-languagedetector` |
| Detection order | localStorage (`petlanka_lang`) → navigator → fallback `en` |
| Shared package | `packages/i18n` (`@petlanka/i18n`) — status/validation strings only |
| Per-app namespaces | `common`, `auth`, `shell`, `home` (client); `common`, `auth`, `shell`, `dashboard` (admin) |
| Fonts | Noto Sans Sinhala + Noto Sans Tamil (Google Fonts, per-locale `<link>`) |

---

## Package Structure

```
packages/i18n/
  package.json          # name: @petlanka/i18n
  src/
    index.ts            # exports en/si/ta common namespace objects
    locales/
      en/common.json    # status labels, validation messages
      si/common.json
      ta/common.json

apps/client/src/i18n/
  index.ts              # i18next init — imports @petlanka/i18n + local namespaces
  locales/
    en/
      auth.json
      shell.json
      home.json
    si/
      auth.json
      shell.json
      home.json
    ta/
      auth.json
      shell.json
      home.json

apps/admin/src/i18n/
  index.ts
  locales/
    en/
      auth.json
      shell.json
      dashboard.json
    si/
      auth.json
      shell.json
      dashboard.json
    ta/
      auth.json
      shell.json
      dashboard.json
```

### Namespace table

| Namespace | Owner | Contents |
|-----------|-------|----------|
| `common` | `@petlanka/i18n` | Status labels, validation errors, shared UI strings |
| `auth` | per-app | Login, OTP, register screens |
| `shell` | per-app | Nav labels, header, logout |
| `home` | client | Dashboard tiles, quick actions |
| `dashboard` | admin | Stats, tables, admin-specific UI |

### i18next init (same pattern for both apps)

```ts
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { enCommon, siCommon, taCommon } from '@petlanka/i18n';

import enAuth from './locales/en/auth.json';
import enShell from './locales/en/shell.json';
import enHome from './locales/en/home.json';
// ... si/ta imports

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, auth: enAuth, shell: enShell, home: enHome },
      si: { common: siCommon, auth: siAuth, shell: siShell, home: siHome },
      ta: { common: taCommon, auth: taAuth, shell: taShell, home: taHome },
    },
    lng: undefined,          // let detector decide
    fallbackLng: 'en',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'petlanka_lang',
    },
    interpolation: { escapeValue: false }, // React escapes already
  });

export default i18n;
```

---

## Language Detection

- Order: `localStorage` (`petlanka_lang`) → `navigator` → fallback `en`
- `i18n.changeLanguage('si')` writes to localStorage automatically
- `document.documentElement.lang` updated in `LanguageSwitcher` on change

---

## Font Support

Add to `index.html` (both apps):

```html
<!-- Noto Sans Sinhala — loaded only when needed; defer to avoid blocking -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;600;700&display=swap">
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap">
```

Tailwind config — add font families:

```js
fontFamily: {
  display: ['Sora', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'sans-serif'],
  body:    ['Work Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'sans-serif'],
}
```

`document.documentElement.lang` set on each language change (in `LanguageSwitcher`).

---

## Client Translation Keys

### `auth` namespace (sample)

```json
{
  "welcome": { "title": "Welcome to PetLanka", "tagline": "...", "loginBtn": "Login", "signupBtn": "Sign Up" },
  "login": { "title": "Login", "phonePlaceholder": "Phone number", "emailPlaceholder": "Email address", ... },
  "otp": { "title": "Verify OTP", "placeholder": "Enter 6-digit code", "resend": "Resend", ... },
  "register": { "title": "Create Account", "fullName": "Full Name", "nic": "NIC", ... }
}
```

### `shell` namespace

```json
{
  "nav": { "home": "Home", "myPets": "My Pets", "apply": "Apply", "profile": "Profile" },
  "header": { "greeting": "Good morning", "notifications": "Notifications" },
  "logout": "Logout"
}
```

### `home` namespace

```json
{
  "title": "My Dashboard",
  "quickActions": { "addPet": "Add Pet", "applyLicence": "Apply for Licence", "renewLicence": "Renew Licence" }
}
```

---

## Admin Translation Keys

### `auth` namespace

```json
{
  "login": { "title": "Admin Portal", "emailPlaceholder": "Email", "passwordPlaceholder": "Password", "submitBtn": "Sign In" }
}
```

### `shell` namespace

```json
{
  "nav": { "dashboard": "Dashboard", "applications": "Applications", "users": "Users", "settings": "Settings" },
  "logout": "Logout"
}
```

### `dashboard` namespace

```json
{
  "title": "Dashboard",
  "stats": { "totalApplications": "Total Applications", "pending": "Pending", "approved": "Approved" }
}
```

---

## Shared Translations (`@petlanka/i18n` — `common` namespace)

### Status labels

```json
{
  "status": {
    "PENDING": "Pending",
    "APPROVED": "Approved",
    "REJECTED": "Rejected",
    "EXPIRED": "Expired",
    "ACTIVE": "Active",
    "INACTIVE": "Inactive"
  },
  "validation": {
    "required": "This field is required",
    "invalidPhone": "Enter a valid Sri Lankan phone number",
    "invalidNic": "Enter a valid NIC number",
    "invalidEmail": "Enter a valid email address"
  }
}
```

**StatusBadge change:** Remove `label` prop — resolve via `t('status.STATUS', { ns: 'common' })` inside the component.

---

## LanguageSwitcher

Wire the existing `EN / සි / த` buttons in `AppShell.tsx` and `AdminShell.tsx`:

```tsx
const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සි' },
  { code: 'ta', label: 'த' },
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const change = (code: string) => {
    i18n.changeLanguage(code);
    document.documentElement.lang = code;
  };
  return (
    <div className="flex gap-0.5 bg-surface p-[3px] rounded-lg text-[11.5px] font-bold">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => change(code)}
          className={i18n.resolvedLanguage === code
            ? 'px-2 py-[5px] rounded-md bg-white text-primary'
            : 'px-2 py-[5px] text-muted'}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
```

---

## Files Touched

| File | Change |
|------|--------|
| `packages/i18n/package.json` | New package `@petlanka/i18n` |
| `packages/i18n/src/index.ts` | Export en/si/ta common objects |
| `packages/i18n/src/locales/en/common.json` | Status + validation strings EN |
| `packages/i18n/src/locales/si/common.json` | Status + validation strings SI |
| `packages/i18n/src/locales/ta/common.json` | Status + validation strings TA |
| `packages/i18n/tsconfig.json` | TypeScript config |
| `pnpm-workspace.yaml` | Already includes `packages/*` — no change needed |
| `apps/client/package.json` | Add `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `@petlanka/i18n` |
| `apps/client/src/i18n/index.ts` | i18next init |
| `apps/client/src/i18n/locales/en/auth.json` | EN auth strings |
| `apps/client/src/i18n/locales/en/shell.json` | EN shell strings |
| `apps/client/src/i18n/locales/en/home.json` | EN home strings |
| `apps/client/src/i18n/locales/si/auth.json` | SI auth strings |
| `apps/client/src/i18n/locales/si/shell.json` | SI shell strings |
| `apps/client/src/i18n/locales/si/home.json` | SI home strings |
| `apps/client/src/i18n/locales/ta/auth.json` | TA auth strings |
| `apps/client/src/i18n/locales/ta/shell.json` | TA shell strings |
| `apps/client/src/i18n/locales/ta/home.json` | TA home strings |
| `apps/client/src/main.tsx` | Import `./i18n` before render |
| `apps/client/src/layouts/AppShell.tsx` | Add `LanguageSwitcher`, `useTranslation` in nav labels |
| `apps/client/src/pages/auth/WelcomePage.tsx` | `useTranslation('auth')` |
| `apps/client/src/pages/auth/LoginPage.tsx` | `useTranslation('auth')` |
| `apps/client/src/pages/auth/OtpVerifyPage.tsx` | `useTranslation('auth')` |
| `apps/client/src/pages/auth/RegisterPage.tsx` | `useTranslation('auth')` |
| `apps/client/src/components/StatusBadge.tsx` | Remove `label` prop; use `t('status.X', {ns:'common'})` |
| `apps/client/index.html` | Add Noto Sans Sinhala + Tamil `<link>` |
| `apps/client/tailwind.config.js` | Add Noto fonts to fontFamily fallback |
| `apps/admin/package.json` | Add i18n deps + `@petlanka/i18n` |
| `apps/admin/src/i18n/index.ts` | i18next init |
| `apps/admin/src/i18n/locales/en/auth.json` | EN auth strings |
| `apps/admin/src/i18n/locales/en/shell.json` | EN shell strings |
| `apps/admin/src/i18n/locales/en/dashboard.json` | EN dashboard strings |
| `apps/admin/src/i18n/locales/si/` | SI translations (3 files) |
| `apps/admin/src/i18n/locales/ta/` | TA translations (3 files) |
| `apps/admin/src/main.tsx` | Import `./i18n` before render |
| `apps/admin/src/layouts/AdminShell.tsx` | Add `LanguageSwitcher`, `useTranslation` in nav labels |
| `apps/admin/src/pages/auth/LoginPage.tsx` | `useTranslation('auth')` |
| `apps/admin/index.html` | Add Noto Sans fonts |
| `apps/admin/tailwind.config.js` | Add Noto fonts to fontFamily fallback |

---

## Verification

- [ ] `pnpm --filter @petlanka/i18n build` passes
- [ ] `pnpm --filter @petlanka/client dev` — EN renders correctly on all auth pages, AppShell, HomePage
- [ ] Language switcher changes locale to Sinhala: all strings switch, Noto Sans Sinhala font loads
- [ ] Language switcher changes locale to Tamil: all strings switch, Noto Sans Tamil font loads
- [ ] `document.documentElement.lang` updates to `si` / `ta` on switch
- [ ] Reload page — selected language persists (localStorage key `petlanka_lang`)
- [ ] `pnpm --filter @petlanka/admin dev` — EN renders on login and dashboard shell
- [ ] Admin LanguageSwitcher (EN/සි/த) switches locale
- [ ] StatusBadge renders correct translated label (no `label` prop required)
- [ ] `pnpm typecheck` — zero errors across all packages
- [ ] No TypeScript `any` from missing namespace types
