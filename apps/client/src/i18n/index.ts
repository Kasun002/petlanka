import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { enCommon, siCommon, taCommon } from '@petlanka/i18n';

import enAuth from './locales/en/auth.json';
import enShell from './locales/en/shell.json';
import enHome from './locales/en/home.json';
import enPets from './locales/en/pets.json';
import enApply from './locales/en/apply.json';
import enProfile from './locales/en/profile.json';
import siAuth from './locales/si/auth.json';
import siShell from './locales/si/shell.json';
import siHome from './locales/si/home.json';
import siPets from './locales/si/pets.json';
import siApply from './locales/si/apply.json';
import siProfile from './locales/si/profile.json';
import taAuth from './locales/ta/auth.json';
import taShell from './locales/ta/shell.json';
import taHome from './locales/ta/home.json';
import taPets from './locales/ta/pets.json';
import taApply from './locales/ta/apply.json';
import taProfile from './locales/ta/profile.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, auth: enAuth, shell: enShell, home: enHome, pets: enPets, apply: enApply, profile: enProfile },
      si: { common: siCommon, auth: siAuth, shell: siShell, home: siHome, pets: siPets, apply: siApply, profile: siProfile },
      ta: { common: taCommon, auth: taAuth, shell: taShell, home: taHome, pets: taPets, apply: taApply, profile: taProfile },
    },
    fallbackLng: 'en',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'petlanka_lang',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
