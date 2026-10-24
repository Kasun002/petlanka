import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Application } from '../types/application';
import rawData from '../data/applications.json';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import ApplicationFilters, { type AppFilters } from '../components/applications/ApplicationFilters';
import ApplicationsTable from '../components/applications/ApplicationsTable';

const data = rawData.list as Application[];
const PER_PAGE = 10;

export default function ApplicationsPage() {
  const { t } = useTranslation('applications');
  const [filters, setFilters] = useState<AppFilters>({ search: '', status: '', type: '', district: '' });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return data.filter((a) => {
      if (filters.status   && a.status   !== filters.status)   return false;
      if (filters.type     && a.type     !== filters.type)     return false;
      if (filters.district && a.district !== filters.district) return false;
      if (q && !a.applicant.toLowerCase().includes(q) && !a.pet.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilters = (f: AppFilters) => { setFilters(f); setPage(1); };

  return (
    <div className="space-y-5">
      <h2 className="text-[15px] font-bold">{t('title')}</h2>
      <Card>
        <ApplicationFilters value={filters} onChange={handleFilters} />
        {paginated.length === 0
          ? <EmptyState message={t('filters.searchPlaceholder')} />
          : <ApplicationsTable rows={paginated} />
        }
        <Pagination total={filtered.length} perPage={PER_PAGE} current={page} onChange={setPage} />
      </Card>
    </div>
  );
}
