import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import petsData from '../data/pets.json';
import type { Pet } from '../types/pet';
import PetListItem from '../components/pets/PetListItem';

const pets = petsData as Pet[];

export default function PetsPage() {
  const { t } = useTranslation('pets');
  const navigate = useNavigate();

  return (
    <div className="px-5 pt-[18px] pb-4 md:max-w-[720px] md:mx-auto md:px-10 md:pt-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-bold font-display">{t('title')}</h1>
        <button
          onClick={() => navigate('/apply')}
          className="flex items-center gap-1.5 bg-primary text-white text-[12.5px] font-semibold px-3.5 py-2 rounded-xl hover:bg-primary-dark transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="block">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('applyNew')}
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4C0B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block">
              <circle cx="7" cy="8.5" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="17" cy="8.5" r="1.5" />
              <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
            </svg>
          </div>
          <p className="font-bold text-[15px] mb-1">{t('noPets')}</p>
          <p className="text-[13px] text-muted mb-5">{t('noPetsSubtitle')}</p>
          <button
            onClick={() => navigate('/apply')}
            className="bg-primary text-white text-[13.5px] font-semibold px-5 py-3 rounded-xl hover:bg-primary-dark transition-colors"
          >
            {t('registerFirst')}
          </button>
        </div>
      ) : (
        <div className="space-y-3 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
          {pets.map((pet) => <PetListItem key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  );
}
