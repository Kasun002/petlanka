import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { enCommon, siCommon, taCommon } from '@petlanka/i18n';

import enAuth from './locales/en/auth.json';
import enShell from './locales/en/shell.json';
import enHome from './locales/en/home.json';
import siAuth from './locales/si/auth.json';
import siShell from './locales/si/shell.json';
import siHome from './locales/si/home.json';
import taAuth from './locales/ta/auth.json';
import taShell from './locales/ta/shell.json';
import taHome from './locales/ta/home.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, auth: enAuth, shell: enShell, home: enHome },
      si: { common: siCommon, auth: siAuth, shell: siShell, home: siHome },
      ta: { common: taCommon, auth: taAuth, shell: taShell, home: taHome },
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
