import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Prefs {
  emailApproval: boolean;
  emailRejection: boolean;
  emailExpiry: boolean;
  emailAssign: boolean;
  smsApproval: boolean;
  smsExpiry: boolean;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-black/[0.05] last:border-0">
      <span className="text-[13px] text-gray-700">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function NotificationsPanel() {
  const { t } = useTranslation('settings');
  const [prefs, setPrefs] = useState<Prefs>({
    emailApproval: true, emailRejection: true, emailExpiry: true, emailAssign: false,
    smsApproval: false, smsExpiry: true,
  });
  const toggle = (key: keyof Prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="p-6 max-w-lg">
      <h3 className="text-[14px] font-bold mb-4">{t('notifications.title')}</h3>
      <p className="text-[12.5px] font-bold text-muted uppercase tracking-wide mb-2">{t('notifications.emailSection')}</p>
      <Row label={t('notifications.onApproval')}  checked={prefs.emailApproval}  onChange={() => toggle('emailApproval')} />
      <Row label={t('notifications.onRejection')} checked={prefs.emailRejection} onChange={() => toggle('emailRejection')} />
      <Row label={t('notifications.onExpiry')}    checked={prefs.emailExpiry}    onChange={() => toggle('emailExpiry')} />
      <Row label={t('notifications.onAssign')}    checked={prefs.emailAssign}    onChange={() => toggle('emailAssign')} />
      <p className="text-[12.5px] font-bold text-muted uppercase tracking-wide mt-5 mb-2">{t('notifications.smsSection')}</p>
      <Row label={t('notifications.onApproval')}  checked={prefs.smsApproval}   onChange={() => toggle('smsApproval')} />
      <Row label={t('notifications.onExpiry')}    checked={prefs.smsExpiry}     onChange={() => toggle('smsExpiry')} />
      <button className="mt-5 h-10 px-6 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
        {t('notifications.save')}
      </button>
    </div>
  );
}
