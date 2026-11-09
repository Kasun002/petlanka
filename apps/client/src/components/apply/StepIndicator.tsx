import { useTranslation } from 'react-i18next';

interface Props {
  current: number; // 0-indexed
}

export default function StepIndicator({ current }: Readonly<Props>) {
  const { t } = useTranslation('apply');
  const steps = [t('steps.petInfo'), t('steps.documents'), t('steps.review')];

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            {/* connector line */}
            {i < steps.length - 1 && (
              <div
                className={`absolute left-1/2 top-[13px] w-full h-[2px] ${done ? 'bg-primary' : 'bg-gray-200'}`}
                style={{ left: '50%', width: 'calc(100% - 0px)' }}
              />
            )}
            <div
              className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold z-10 relative transition-colors ${
                active ? 'bg-primary text-white' : done ? 'bg-primary text-white' : 'bg-gray-200 text-muted'
              }`}
            >
              {done ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="block">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`mt-1.5 text-[10.5px] font-medium text-center ${active ? 'text-primary' : done ? 'text-primary' : 'text-muted'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
