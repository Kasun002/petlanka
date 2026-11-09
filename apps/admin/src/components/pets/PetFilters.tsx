import { useTranslation } from 'react-i18next';
import SearchInput from '../ui/SearchInput';
import SelectInput from '../ui/SelectInput';

const DISTRICTS = ['Colombo','Gampaha','Kandy','Kalutara','Galle','Matara','Kurunegala','Negombo'];

export interface PetFilters {
  search: string;
  species: string;
  status: string;
  district: string;
}

interface Props {
  value: PetFilters;
  onChange: (f: PetFilters) => void;
}

export default function PetFilters({ value, onChange }: Readonly<Props>) {
  const { t } = useTranslation('pets');
  const set = (patch: Partial<PetFilters>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-black/[0.06]">
      <SearchInput
        value={value.search}
        onChange={(search) => set({ search })}
        placeholder={t('filters.searchPlaceholder')}
      />
      <SelectInput value={value.species} onChange={(e) => set({ species: e.target.value })}>
        <option value="">{t('filters.allSpecies')}</option>
        {['Dog','Cat','Other'].map((s) => <option key={s} value={s}>{s}</option>)}
      </SelectInput>
      <SelectInput value={value.status} onChange={(e) => set({ status: e.target.value })}>
        <option value="">{t('filters.allStatuses')}</option>
        {['ACTIVE','EXPIRED','INACTIVE'].map((s) => <option key={s} value={s}>{s}</option>)}
      </SelectInput>
      <SelectInput value={value.district} onChange={(e) => set({ district: e.target.value })}>
        <option value="">{t('filters.allDistricts')}</option>
        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </SelectInput>
    </div>
  );
}
