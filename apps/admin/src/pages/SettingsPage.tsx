import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import SettingsTabs from '../components/settings/SettingsTabs';
import GeneralPanel from '../components/settings/GeneralPanel';
import FeesPanel from '../components/settings/FeesPanel';
import NotificationsPanel from '../components/settings/NotificationsPanel';

type Tab = 'general' | 'fees' | 'notifications';

export default function SettingsPage() {
  const { t } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState<Tab>('general');

  return (
    <div className="space-y-5">
      <h2 className="text-[15px] font-bold">{t('title')}</h2>
      <Card>
        <SettingsTabs active={activeTab} onChange={setActiveTab} />
        {activeTab === 'general'       && <GeneralPanel />}
        {activeTab === 'fees'          && <FeesPanel />}
        {activeTab === 'notifications' && <NotificationsPanel />}
      </Card>
    </div>
  );
}
