import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  /** Compact button variant for the desktop header row */
  compact?: boolean;
}

export default function RegisterPetBanner({ compact = false }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation('home');

  if (compact) {
    return (
      <button
        onClick={() => navigate('/apply')}
        className="flex items-center gap-2 h-11 px-4 rounded-xl text-[13.5px] font-semibold text-[#241505] transition-opacity hover:opacity-90"
        style={{ background: '#E8863A' }}
      >
        <svg width="16" height="16" fill="none" stroke="#241505" strokeWidth="2.2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {t('registerPet')}
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate('/apply')}
      className="w-full flex items-center gap-3.5 p-4 rounded-2xl text-left transition-opacity hover:opacity-90"
      style={{ background: 'linear-gradient(135deg, #E8863A, #D9702A)' }}
    >
      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="font-bold text-white text-[15px]">{t('registerPet')}</p>
        <p className="text-[12.5px] text-white/85 mt-0.5">{t('registerPetSubtitle')}</p>
      </div>
      <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
