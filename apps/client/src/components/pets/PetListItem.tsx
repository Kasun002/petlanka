import { useNavigate } from 'react-router-dom';
import type { Pet } from '../../types/pet';
import StatusBadge from '../ui/StatusBadge';

const SPECIES_STYLE: Record<string, { bg: string; stroke: string }> = {
  Cat:    { bg: '#E3F2ED', stroke: '#0F7A63' },
  Dog:    { bg: '#FCF0DA', stroke: '#B4740C' },
  Bird:   { bg: '#EAF2FB', stroke: '#2461C7' },
  Rabbit: { bg: '#EFEAFB', stroke: '#5B3FA8' },
  Other:  { bg: '#F3F4F6', stroke: '#6B7280' },
};

interface Props {
  pet: Pet;
}

export default function PetListItem({ pet }: Readonly<Props>) {
  const navigate = useNavigate();
  const style = SPECIES_STYLE[pet.species] ?? SPECIES_STYLE.Other;

  return (
    <button
      onClick={() => navigate(`/pets/${pet.id}`)}
      className="w-full flex items-center gap-3.5 bg-white rounded-2xl border border-black/5 shadow-sm px-4 py-3.5 text-left hover:shadow-md transition-shadow"
    >
      <div
        className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ background: style.bg }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={style.stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block">
          <circle cx="7" cy="8.5" r="1.5" />
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="17" cy="8.5" r="1.5" />
          <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14.5px] leading-tight">{pet.name}</p>
        <p className="text-[12px] text-muted mt-0.5 truncate">{pet.species} · {pet.breed}</p>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <StatusBadge status={pet.status} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4C0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
