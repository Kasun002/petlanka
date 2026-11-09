import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AssignRequest, Officer } from '../types/assign';
import rawData from '../data/assign.json';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import SearchInput from '../components/ui/SearchInput';
import SelectInput from '../components/ui/SelectInput';
import AssignTable from '../components/assign/AssignTable';
import AssignModal from '../components/assign/AssignModal';

const PER_PAGE = 10;

export default function AssignPage() {
  const { t } = useTranslation('assign');
  const [requests, setRequests] = useState<AssignRequest[]>(rawData.requests as AssignRequest[]);
  const officers = rawData.officers as Officer[];

  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('');
  const [priority, setPriority] = useState('');
  const [page,     setPage]     = useState(1);
  const [modal,    setModal]    = useState<AssignRequest | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return requests.filter((r) => {
      if (status   && r.status   !== status)   return false;
      if (priority && r.priority !== priority) return false;
      if (q && !r.applicant.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [requests, search, status, priority]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const reset = () => setPage(1);

  const handleConfirm = (requestId: string, officerId: string) => {
    const officer = officers.find((o) => o.id === officerId);
    setRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, assignedTo: officer?.name ?? officerId, status: 'ASSIGNED' } : r)
    );
    setModal(null);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-[15px] font-bold">{t('title')}</h2>
      <Card>
        <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-black/[0.06]">
          <SearchInput value={search} onChange={(v) => { setSearch(v); reset(); }} placeholder={t('filters.searchPlaceholder')} />
          <SelectInput value={status} onChange={(e) => { setStatus(e.target.value); reset(); }}>
            <option value="">{t('filters.allStatuses')}</option>
            {['PENDING','ASSIGNED','COMPLETE'].map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
          </SelectInput>
          <SelectInput value={priority} onChange={(e) => { setPriority(e.target.value); reset(); }}>
            <option value="">{t('filters.allPriorities')}</option>
            {['HIGH','NORMAL'].map((p) => <option key={p} value={p}>{t(`priority.${p}`)}</option>)}
          </SelectInput>
        </div>
        {paginated.length === 0
          ? <EmptyState message={t('filters.searchPlaceholder')} />
          : <AssignTable rows={paginated} onAssign={setModal} />
        }
        <Pagination total={filtered.length} perPage={PER_PAGE} current={page} onChange={setPage} />
      </Card>
      {modal && (
        <AssignModal
          request={modal}
          officers={officers}
          onConfirm={handleConfirm}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
