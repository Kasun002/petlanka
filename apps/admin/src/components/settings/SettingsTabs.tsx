import { useTranslation } from 'react-i18next';

type Tab = 'general' | 'fees' | 'notifications';

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function SettingsTabs({ active, onChange }: Readonly<Props>) {
  const { t } = useTranslation('settings');
  const tabs: Tab[] = ['general', 'fees', 'notifications'];

  return (
    <div className="flex gap-1 border-b border-black/[0.08]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-5 py-3 text-[13px] font-semibold border-b-2 transition-colors ${
            active === tab
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-gray-700'
          }`}
        >
          {t(`tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
}
