import { useTranslation } from 'react-i18next';
import SearchInput from '../ui/SearchInput';
import SelectInput from '../ui/SelectInput';

const DISTRICTS = ['Colombo','Gampaha','Kandy','Kalutara','Galle','Matara','Kurunegala','Negombo'];

export interface AppFilters {
  search: string;
  status: string;
  type: string;
  district: string;
}

interface Props {
  value: AppFilters;
  onChange: (f: AppFilters) => void;
}

export default function ApplicationFilters({ value, onChange }: Readonly<Props>) {
  const { t } = useTranslation('applications');
  const set = (patch: Partial<AppFilters>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2.5 px-5 py-3.5 border-b border-black/[0.06]">
      <SearchInput
        value={value.search}
        onChange={(search) => set({ search })}
        placeholder={t('filters.searchPlaceholder')}
      />
      <SelectInput value={value.status} onChange={(e) => set({ status: e.target.value })}>
        <option value="">{t('filters.allStatuses')}</option>
        {['PENDING','REVIEW','APPROVED','REJECTED'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </SelectInput>
      <SelectInput value={value.type} onChange={(e) => set({ type: e.target.value })}>
        <option value="">{t('filters.allTypes')}</option>
        {['New','Renewal','Transfer'].map((tp) => (
          <option key={tp} value={tp}>{tp}</option>
        ))}
      </SelectInput>
      <SelectInput value={value.district} onChange={(e) => set({ district: e.target.value })}>
        <option value="">{t('filters.allDistricts')}</option>
        {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </SelectInput>
    </div>
  );
}
