import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectInput from '../ui/SelectInput';

const inp = 'w-full h-10 rounded-[9px] border border-black/[0.12] px-3 text-[13px] bg-white focus:outline-none focus:border-primary';
const lbl = 'block text-[12.5px] font-semibold mb-1.5 text-gray-700';

export default function GeneralPanel() {
  const { t } = useTranslation('settings');
  const [orgName,  setOrgName]  = useState('PetLanka Registry — Western Province');
  const [email,    setEmail]    = useState('info@petlanka.gov.lk');
  const [timezone, setTimezone] = useState('Asia/Colombo');

  return (
    <div className="p-6 space-y-5 max-w-lg">
      <h3 className="text-[14px] font-bold">{t('general.title')}</h3>
      <div>
        <label className={lbl}>{t('general.orgName')}</label>
        <input className={inp} value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder={t('general.orgNamePlaceholder')} />
      </div>
      <div>
        <label className={lbl}>{t('general.contactEmail')}</label>
        <input type="email" className={inp} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('general.contactEmailPlaceholder')} />
      </div>
      <div>
        <label className={lbl}>{t('general.timezone')}</label>
        <SelectInput className="h-10 w-full" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          <option value="Asia/Colombo">Asia/Colombo (UTC+5:30)</option>
          <option value="UTC">UTC</option>
        </SelectInput>
      </div>
      <button className="h-10 px-6 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
        {t('general.save')}
      </button>
    </div>
  );
}
