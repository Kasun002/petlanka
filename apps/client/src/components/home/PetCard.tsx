import type { HomePet } from '../../types/home';
import StatusBadge from '../ui/StatusBadge';

const ICON_STYLES: Record<string, { bg: string; stroke: string }> = {
  Cat: { bg: '#E3F2ED', stroke: '#0F7A63' },
  Dog: { bg: '#FCF0DA', stroke: '#B4740C' },
};

interface Props {
  pet: HomePet;
}

export default function PetCard({ pet }: Props) {
  const icon = ICON_STYLES[pet.species] ?? { bg: '#F3F4F6', stroke: '#6B7280' };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3.5 flex-shrink-0 min-w-[150px] md:min-w-0 md:flex md:gap-3.5 md:items-start">
      <div
        className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-2.5 md:mb-0 flex-shrink-0"
        style={{ background: icon.bg }}
      >
        <svg width="24" height="24" fill="none" stroke={icon.stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7" cy="8.5" r="1.5" />
          <circle cx="12" cy="6" r="1.5" />
          <circle cx="17" cy="8.5" r="1.5" />
          <path d="M8.5 13.2c-2 .6-3.2 2.2-3 4 .2 1.8 1.8 2.8 3.5 2.2.9-.3 1.7-.3 2.6 0l.4.1c.9.3 1.7.3 2.6 0 1.7-.6 3.3-1.6 3.5-3.4.2-1.8-1-3.4-3-4-2.1-.6-4.5-.6-6.6 0Z" />
        </svg>
      </div>
      <div>
        <p className="font-bold text-[14px]">{pet.name}</p>
        <p className="text-[11.5px] text-muted mt-0.5 mb-2">{pet.breed}</p>
        <StatusBadge status={pet.status} label={pet.statusLabel} />
      </div>
    </div>
  );
}
