import { useTranslation } from 'react-i18next';
import type { AppStatus } from '../../types/application';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';

interface Props {
  status: AppStatus;
  notes: string;
  onNotesChange: (v: string) => void;
  onAction: (action: AppStatus) => void;
}

export default function ReviewActions({ status, notes, onNotesChange, onAction }: Readonly<Props>) {
  const { t } = useTranslation('applications');

  return (
    <Card className="p-5 space-y-5">
      <div>
        <p className="text-[11.5px] font-bold text-muted uppercase tracking-wide mb-2">
          {t('review.currentStatus')}
        </p>
        <StatusBadge status={status} />
      </div>

      <div>
        <label className="block text-[12.5px] font-semibold mb-1.5">{t('review.notes')}</label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={t('review.notesPlaceholder')}
          rows={4}
          className="w-full rounded-xl border border-black/[0.12] px-3.5 py-2.5 text-[13px] resize-none focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2.5">
        <button
          onClick={() => onAction('APPROVED')}
          disabled={status === 'APPROVED'}
          className="w-full h-10 rounded-xl bg-primary text-white text-[13px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {t('review.approve')}
        </button>
        <button
          onClick={() => onAction('REJECTED')}
          disabled={status === 'REJECTED'}
          className="w-full h-10 rounded-xl bg-red-50 text-[#C0362C] text-[13px] font-semibold disabled:opacity-40 hover:bg-red-100 transition-colors border border-red-200"
        >
          {t('review.reject')}
        </button>
        <button
          onClick={() => onAction('REVIEW')}
          disabled={status === 'REVIEW'}
          className="w-full h-10 rounded-xl bg-surface text-gray-700 text-[13px] font-semibold disabled:opacity-40 hover:bg-gray-100 transition-colors"
        >
          {t('review.requestInfo')}
        </button>
      </div>
    </Card>
  );
}
