import { useTranslation } from 'react-i18next';
import type { Pet } from '../../types/pet';

interface Props {
  pet: Pet;
  onRenew: () => void;
}

export default function LicenceCard({ pet, onRenew }: Readonly<Props>) {
  const { t } = useTranslation('pets');

  if (!pet.licenceNumber) return null;

  const isExpiring = pet.status === 'EXPIRES' || pet.status === 'EXPIRED';

  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-[9px] bg-[#E3F2ED] flex items-center justify-center flex-shrink-0">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 9h10M7 13h6" />
          </svg>
        </div>
        <p className="font-bold text-[13.5px]">{t('licenceInfo')}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-[12px] text-muted">{t('licenceNumber')}</span>
          <span className="text-[12.5px] font-semibold font-mono">{pet.licenceNumber}</span>
        </div>
        {pet.licenceExpiresAt && (
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-muted">{t('expires')}</span>
            <span className={`text-[12.5px] font-semibold ${isExpiring ? 'text-orange' : 'text-gray-700'}`}>
              {new Date(pet.licenceExpiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {isExpiring && (
        <button
          onClick={onRenew}
          className="mt-4 w-full bg-primary text-white py-2.5 rounded-xl text-[13px] font-semibold hover:bg-primary-dark transition-colors"
        >
          {t('renew')}
        </button>
      )}
    </div>
  );
}
