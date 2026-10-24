import { useTranslation } from 'react-i18next';
import type { AdminUser } from '../../types/user';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  rows: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}

const th = 'px-4 py-3 font-semibold text-left';
const td = 'px-4 py-3.5';

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-[#EAF2FB] text-[#2461C7]',
  ADMIN:       'bg-[#E3F2ED] text-primary',
  OFFICER:     'bg-surface text-muted',
};

export default function UsersTable({ rows, onEdit, onToggleStatus }: Readonly<Props>) {
  const { t } = useTranslation('users');

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-[11.5px] font-semibold text-muted border-b border-black/[0.06]">
            <th className={th}>{t('table.name')}</th>
            <th className={th}>{t('table.email')}</th>
            <th className={th}>{t('table.role')}</th>
            <th className={th}>{t('table.district')}</th>
            <th className={th}>{t('table.lastLogin')}</th>
            <th className={th}>{t('table.status')}</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {rows.map((user, i) => (
            <tr
              key={user.id}
              className={`${i < rows.length - 1 ? 'border-b border-black/[0.04]' : ''} hover:bg-surface/50 transition-colors`}
            >
              <td className={`${td} font-semibold text-gray-900`}>{user.name}</td>
              <td className={`${td} text-gray-600 text-[12.5px]`}>{user.email}</td>
              <td className={td}>
                <span className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-[6px] ${ROLE_STYLES[user.role]}`}>
                  {t(`roles.${user.role}`)}
                </span>
              </td>
              <td className={`${td} text-gray-600`}>{user.district}</td>
              <td className={`${td} text-gray-500 text-[12px]`}>{formatDate(user.lastLogin)}</td>
              <td className={td}><StatusBadge status={user.status} /></td>
              <td className={td}>
                <div className="flex items-center gap-3">
                  <button onClick={() => onEdit(user)} className="text-[12px] text-primary font-semibold hover:underline">
                    {t('actions.edit')}
                  </button>
                  <button
                    onClick={() => onToggleStatus(user)}
                    className={`text-[12px] font-semibold hover:underline ${user.status === 'ACTIVE' ? 'text-[#C0362C]' : 'text-[#1E8A5F]'}`}
                  >
                    {user.status === 'ACTIVE' ? t('actions.deactivate') : t('actions.activate')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
