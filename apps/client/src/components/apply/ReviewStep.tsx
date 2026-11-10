import { useTranslation } from 'react-i18next';
import type { PetInfoData } from './PetInfoStep';

interface Props {
  data: PetInfoData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ReviewStep({ data, onBack, onSubmit, isSubmitting }: Readonly<Props>) {
  const { t } = useTranslation('apply');

  const rows: { label: string; value: string }[] = [
    { label: t('review.name'),    value: data.name },
    { label: t('review.species'), value: data.species || '—' },
    { label: t('review.breed'),   value: data.breed },
    { label: t('review.dob'),     value: data.dob ? new Date(data.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
    { label: t('review.microchip'), value: data.microchip || t('review.none') },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-[17px] font-bold mb-1">{t('review.heading')}</h2>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
        <p className="text-[11px] font-bold text-muted uppercase tracking-wide mb-3">{t('review.petDetails')}</p>
        <div className="space-y-2.5">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start gap-4">
              <span className="text-[12px] text-muted flex-shrink-0">{label}</span>
              <span className="text-[13px] font-semibold text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-2xl text-base font-semibold hover:border-gray-300 disabled:opacity-50 transition-colors"
        >
          {t('review.back')}
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? t('review.submitting') : t('review.submit')}
        </button>
      </div>
    </div>
  );
}
