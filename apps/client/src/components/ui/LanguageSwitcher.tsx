import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සි' },
  { code: 'ta', label: 'த' },
];

export default function LanguageSwitcher() {
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
