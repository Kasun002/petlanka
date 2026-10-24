import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AssignRequest, Officer } from '../../types/assign';
import Modal from '../ui/Modal';
import SelectInput from '../ui/SelectInput';

interface Props {
  request: AssignRequest;
  officers: Officer[];
  onConfirm: (requestId: string, officerId: string) => void;
  onClose: () => void;
}

export default function AssignModal({ request, officers, onConfirm, onClose }: Readonly<Props>) {
  const { t } = useTranslation('assign');
  const [selected, setSelected] = useState(request.assignedTo ?? '');

  return (
    <Modal title={t('modal.title')} onClose={onClose}>
      <p className="text-[12.5px] text-muted mb-4">
        {request.applicant} — {request.type} — {request.district}
      </p>

      <label className="block text-[12.5px] font-semibold mb-1.5">{t('modal.selectOfficer')}</label>
      <SelectInput className="h-10 w-full" value={selected} onChange={(e) => setSelected(e.target.value)}>
        <option value="">{t('modal.selectPlaceholder')}</option>
        {officers.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name} ({o.district}) — {o.activeCount} {t('modal.activeCount')}
          </option>
        ))}
      </SelectInput>

      <div className="flex gap-2.5 mt-5">
        <button
          onClick={() => { if (selected) onConfirm(request.id, selected); }}
          disabled={!selected}
          className="flex-1 h-10 rounded-xl bg-primary text-white text-[13px] font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {t('modal.confirm')}
        </button>
        <button
          onClick={onClose}
          className="flex-1 h-10 rounded-xl bg-surface text-gray-700 text-[13px] font-semibold hover:bg-gray-100 transition-colors"
        >
          {t('modal.cancel')}
        </button>
      </div>
    </Modal>
  );
}
