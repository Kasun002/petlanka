import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Owner } from '../types/owner';
import rawData from '../data/owners.json';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import SelectInput from '../components/ui/SelectInput';
import OwnersTable from '../components/owners/OwnersTable';

const data = rawData.list as Owner[];
const PER_PAGE = 10;
const DISTRICTS = ['Colombo','Gampaha','Kandy','Kalutara','Galle','Matara','Kurunegala','Negombo'];

export default function OwnersPage() {
  const { t } = useTranslation('owners');
  const [search,   setSearch]   = useState('');
  const [district, setDistrict] = useState('');
  const [status,   setStatus]   = useState('');
  const [page,     setPage]     = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((o) => {
      if (district && o.district !== district) return false;
      if (status   && o.status   !== status)   return false;
      if (q && !o.name.toLowerCase().includes(q) && !o.nic.includes(q) && !o.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, district, status]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const reset = () => setPage(1);

  return (
    <div className="space-y-5">
      <h2 className="text-[15px] font-bold">{t('title')}</h2>
      <Card>
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-black/[0.06]">
          <SearchInput value={search} onChange={(v) => { setSearch(v); reset(); }} placeholder={t('filters.searchPlaceholder')} />
          <SelectInput value={district} onChange={(e) => { setDistrict(e.target.value); reset(); }}>
            <option value="">{t('filters.allDistricts')}</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </SelectInput>
          <SelectInput value={status} onChange={(e) => { setStatus(e.target.value); reset(); }}>
            <option value="">{t('filters.allStatuses')}</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </SelectInput>
        </div>
        {paginated.length === 0
          ? <EmptyState message={t('filters.searchPlaceholder')} />
          : <OwnersTable rows={paginated} />
        }
        <Pagination total={filtered.length} perPage={PER_PAGE} current={page} onChange={setPage} />
      </Card>
    </div>
  );
}
