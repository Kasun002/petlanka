import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import petsData from '../data/pets.json';
import applicationsData from '../data/applications.json';
import type { Pet } from '../types/pet';
import type { Application } from '../types/application';
import StatusBadge from '../components/ui/StatusBadge';
import LicenceCard from '../components/pets/LicenceCard';

const pets = petsData as Pet[];
const applications = applicationsData as Application[];

const SPECIES_STYLE: Record<string, { bg: string; stroke: string }> = {
  Cat:    { bg: '#E3F2ED', stroke: '#0F7A63' },
  Dog:    { bg: '#FCF0DA', stroke: '#B4740C' },
  Bird:   { bg: '#EAF2FB', stroke: '#2461C7' },
  Rabbit: { bg: '#EFEAFB', stroke: '#5B3FA8' },
  Other:  { bg: '#F3F4F6', stroke: '#6B7280' },
};

const APP_STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  APPROVED:      { bg: '#E5F5EC', color: '#1E8A5F' },
  PENDING:       { bg: '#FCF0DA', color: '#B4740C' },
  INFO_REQUIRED: { bg: '#FCF0DA', color: '#B4740C' },
  REJECTED:      { bg: '#FBE9E7', color: '#C0362C' },
};

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('pets');

  const pet = pets.find((p) => p.id === id);
  if (!pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted text-[14px]">Pet not found.</p>
        <button onClick={() => navigate('/pets')} className="mt-4 text-primary font-semibold text-[13.5px]">← Back to My Pets</button>
      </div>
    );
  }

  const style = SPECIES_STYLE[pet.species] ?? SPECIES_STYLE.Other;
  const petApps = applications.filter((a) => a.petId === pet.id);

  return (
    <div className="px-5 pt-4 pb-6 md:max-w-[720px] md:mx-auto md:px-10 md:pt-8">
      {/* Back */}
      <button
        onClick={() => navigate('/pets')}
        className="flex items-center gap-1.5 text-[13px] text-muted font-medium mb-5 hover:text-gray-700 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        {t('title')}
      </button>

      {/* Hero */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-[68px] h-[68px] rounded-[18px] flex items-center justify-center flex-shrink-0"
          style={{ background: style.bg }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={style.stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="block">
            <circle cx="7" cy="8.5" r="1.5" /><circle cx="12" cy="6" r="1.5" /><circle cx="17" cy="8.5" r="1.5" />
            <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
          </svg>
        </div>
        <div>
          <h1 className="text-[22px] font-bold font-display leading-tight">{pet.name}</h1>
          <p className="text-[13px] text-muted mt-0.5">{pet.species} · {pet.breed}</p>
          <div className="mt-1.5"><StatusBadge status={pet.status} /></div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Pet details */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 space-y-2.5">
          <div className="flex justify-between">
            <span className="text-[12px] text-muted">{t('dob')}</span>
            <span className="text-[12.5px] font-semibold">
              {new Date(pet.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[12px] text-muted">{t('microchip')}</span>
            <span className="text-[12.5px] font-semibold font-mono">{pet.microchip ?? t('noMicrochip')}</span>
          </div>
        </div>

        {/* Licence card */}
        <LicenceCard pet={pet} onRenew={() => navigate('/apply')} />

        {/* Application history */}
        {petApps.length > 0 && (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
            <p className="font-bold text-[13.5px] mb-3">{t('applicationHistory')}</p>
            <div className="space-y-2.5">
              {petApps.map((app) => {
                const s = APP_STATUS_COLOR[app.status] ?? { bg: '#F3F4F6', color: '#6B7280' };
                return (
                  <button
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="w-full flex items-center justify-between py-2 hover:opacity-70 transition-opacity"
                  >
                    <span className="text-[12.5px] text-muted">
                      {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span
                      className="text-[10.5px] font-bold px-2 py-0.5 rounded-[6px]"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
