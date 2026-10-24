import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminUser, AdminRole } from '../types/user';
import rawData from '../data/users.json';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import SelectInput from '../components/ui/SelectInput';
import UsersTable from '../components/users/UsersTable';
import UserFormModal from '../components/users/UserFormModal';

const PER_PAGE = 10;

export default function UsersPage() {
  const { t } = useTranslation('users');
  const [users, setUsers] = useState<AdminUser[]>(rawData.list as AdminUser[]);
  const [search, setSearch] = useState('');
  const [role,   setRole]   = useState('');
  const [status, setStatus] = useState('');
  const [page,   setPage]   = useState(1);
  const [modal,  setModal]  = useState<AdminUser | null | 'new'>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      if (role   && u.role   !== role)   return false;
      if (status && u.status !== status) return false;
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [users, search, role, status]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const reset = () => setPage(1);

  const handleSave = (data: Pick<AdminUser, 'name' | 'email' | 'role' | 'district'>) => {
    if (modal === 'new') {
      const newUser: AdminUser = { id: `USR-${Date.now()}`, ...data, lastLogin: new Date().toISOString(), status: 'ACTIVE' };
      setUsers((prev) => [newUser, ...prev]);
    } else if (modal) {
      setUsers((prev) => prev.map((u) => u.id === modal.id ? { ...u, ...data } : u));
    }
    setModal(null);
  };

  const handleToggle = (user: AdminUser) =>
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold">{t('title')}</h2>
        <button onClick={() => setModal('new')} className="h-9 px-4 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
          + {t('addUser')}
        </button>
      </div>
      <Card>
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-black/[0.06]">
          <SearchInput value={search} onChange={(v) => { setSearch(v); reset(); }} placeholder={t('filters.searchPlaceholder')} />
          <SelectInput value={role} onChange={(e) => { setRole(e.target.value); reset(); }}>
            <option value="">{t('filters.allRoles')}</option>
            {(['SUPER_ADMIN','ADMIN','OFFICER'] as AdminRole[]).map((r) => <option key={r} value={r}>{t(`roles.${r}`)}</option>)}
          </SelectInput>
          <SelectInput value={status} onChange={(e) => { setStatus(e.target.value); reset(); }}>
            <option value="">{t('filters.allStatuses')}</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </SelectInput>
        </div>
        {paginated.length === 0
          ? <EmptyState message={t('filters.searchPlaceholder')} />
          : <UsersTable rows={paginated} onEdit={setModal} onToggleStatus={handleToggle} />
        }
        <Pagination total={filtered.length} perPage={PER_PAGE} current={page} onChange={setPage} />
      </Card>
      {modal && (
        <UserFormModal
          user={modal === 'new' ? undefined : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
