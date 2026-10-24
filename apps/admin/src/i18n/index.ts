import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { enCommon, siCommon, taCommon } from '@petlanka/i18n';

import enAuth from './locales/en/auth.json';
import enShell from './locales/en/shell.json';
import enDashboard from './locales/en/dashboard.json';
import enApps from './locales/en/apps.json';
import enPets from './locales/en/pets.json';
import enOwners from './locales/en/owners.json';
import enReports from './locales/en/reports.json';
import enAssign from './locales/en/assign.json';
import enUsers from './locales/en/users.json';
import enSettings from './locales/en/settings.json';

import siAuth from './locales/si/auth.json';
import siShell from './locales/si/shell.json';
import siDashboard from './locales/si/dashboard.json';
import siApps from './locales/si/apps.json';
import siPets from './locales/si/pets.json';
import siOwners from './locales/si/owners.json';
import siReports from './locales/si/reports.json';
import siAssign from './locales/si/assign.json';
import siUsers from './locales/si/users.json';
import siSettings from './locales/si/settings.json';

import taAuth from './locales/ta/auth.json';
import taShell from './locales/ta/shell.json';
import taDashboard from './locales/ta/dashboard.json';
import taApps from './locales/ta/apps.json';
import taPets from './locales/ta/pets.json';
import taOwners from './locales/ta/owners.json';
import taReports from './locales/ta/reports.json';
import taAssign from './locales/ta/assign.json';
import taUsers from './locales/ta/users.json';
import taSettings from './locales/ta/settings.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, auth: enAuth, shell: enShell, dashboard: enDashboard, applications: enApps, pets: enPets, owners: enOwners, reports: enReports, assign: enAssign, users: enUsers, settings: enSettings },
      si: { common: siCommon, auth: siAuth, shell: siShell, dashboard: siDashboard, applications: siApps, pets: siPets, owners: siOwners, reports: siReports, assign: siAssign, users: siUsers, settings: siSettings },
      ta: { common: taCommon, auth: taAuth, shell: taShell, dashboard: taDashboard, applications: taApps, pets: taPets, owners: taOwners, reports: taReports, assign: taAssign, users: taUsers, settings: taSettings },
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
