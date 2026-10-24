import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../types/pet';
import rawData from '../data/pets.json';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import PetFilters, { type PetFilters as PetFilterState } from '../components/pets/PetFilters';
import PetRegistryTable from '../components/pets/PetRegistryTable';

const data = rawData.list as Pet[];
const PER_PAGE = 10;

export default function PetRegistryPage() {
  const { t } = useTranslation('pets');
  const [filters, setFilters] = useState<PetFilterState>({ search: '', species: '', status: '', district: '' });
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return data.filter((p) => {
      if (filters.species  && p.species  !== filters.species)  return false;
      if (filters.status   && p.status   !== filters.status)   return false;
      if (filters.district && p.district !== filters.district) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.owner.toLowerCase().includes(q) && !p.microchip.includes(q)) return false;
      return true;
    });
  }, [filters]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilters = (f: PetFilterState) => { setFilters(f); setPage(1); };

  return (
    <div className="space-y-5">
      <h2 className="text-[15px] font-bold">{t('title')}</h2>
      <Card>
        <PetFilters value={filters} onChange={handleFilters} />
        {paginated.length === 0
          ? <EmptyState message={t('filters.searchPlaceholder')} />
          : <PetRegistryTable rows={paginated} />
        }
        <Pagination total={filtered.length} perPage={PER_PAGE} current={page} onChange={setPage} />
      </Card>
    </div>
  );
}
