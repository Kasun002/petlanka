import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Pet } from '../types/pet';
import rawData from '../data/pets.json';
import PetDetailCard from '../components/pets/PetDetailCard';

const data = rawData.list as Pet[];

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('pets');

  const pet = data.find((p) => p.id === id);

  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted text-[13px]">
        Pet not found.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/pets')}
        className="flex items-center gap-1.5 text-[13px] text-primary font-semibold hover:underline"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
          <path d="M9 3L4 7l5 4" />
        </svg>
        {t('title')}
      </button>
      <h2 className="text-[15px] font-bold">{t('detail.title')}</h2>
      <div className="max-w-lg">
        <PetDetailCard pet={pet} />
      </div>
    </div>
  );
}
