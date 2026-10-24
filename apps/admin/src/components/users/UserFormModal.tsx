import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminUser, AdminRole } from '../../types/user';
import Modal from '../ui/Modal';
import SelectInput from '../ui/SelectInput';

const DISTRICTS = ['—','Colombo','Gampaha','Kandy','Kalutara','Galle','Matara','Kurunegala','Negombo'];
const ROLES: AdminRole[] = ['SUPER_ADMIN', 'ADMIN', 'OFFICER'];

interface Props {
  user?: AdminUser;
  onSave: (data: Pick<AdminUser, 'name' | 'email' | 'role' | 'district'>) => void;
  onClose: () => void;
}

const inp = 'w-full h-10 rounded-[9px] border border-black/[0.12] px-3 text-[13px] bg-white focus:outline-none focus:border-primary';
const lbl = 'block text-[12.5px] font-semibold mb-1.5';

export default function UserFormModal({ user, onSave, onClose }: Readonly<Props>) {
  const { t } = useTranslation('users');
  const [name,     setName]     = useState(user?.name     ?? '');
  const [email,    setEmail]    = useState(user?.email    ?? '');
  const [role,     setRole]     = useState<AdminRole>(user?.role ?? 'OFFICER');
  const [district, setDistrict] = useState(user?.district ?? '—');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return;
    onSave({ name, email, role, district });
  };

  return (
    <Modal title={user ? t('form.editTitle') : t('form.addTitle')} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className={lbl}>{t('form.name')}</label>
          <input className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('form.namePlaceholder')} />
        </div>
        <div>
          <label className={lbl}>{t('form.email')}</label>
          <input type="email" className={inp} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('form.emailPlaceholder')} />
        </div>
        <div>
          <label className={lbl}>{t('form.role')}</label>
          <SelectInput className="h-10 w-full" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
            {ROLES.map((r) => <option key={r} value={r}>{t(`roles.${r}`)}</option>)}
          </SelectInput>
        </div>
        <div>
          <label className={lbl}>{t('form.district')}</label>
          <SelectInput className="h-10 w-full" value={district} onChange={(e) => setDistrict(e.target.value)}>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </SelectInput>
        </div>
        <div className="flex gap-2.5 pt-1">
          <button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
            {t('form.save')}
          </button>
          <button onClick={onClose} className="flex-1 h-10 rounded-xl bg-surface text-gray-700 text-[13px] font-semibold hover:bg-gray-100 transition-colors">
            {t('form.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
