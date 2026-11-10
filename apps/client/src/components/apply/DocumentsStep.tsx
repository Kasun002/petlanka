import { useTranslation } from 'react-i18next';

interface Props {
  onBack: () => void;
  onNext: () => void;
}

const DOC_ICONS = [
  <svg key="photo" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  <svg key="cert" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h6"/></svg>,
  <svg key="licence" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  <svg key="nic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0"><circle cx="9" cy="8" r="3"/><path d="M2 21c1-4 3.5-6 7-6"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>,
];

export default function DocumentsStep({ onBack, onNext }: Readonly<Props>) {
  const { t } = useTranslation('apply');
  const items = t('documents.items', { returnObjects: true }) as string[];

  return (
    <div className="space-y-4">
      <h2 className="text-[17px] font-bold mb-1">{t('documents.heading')}</h2>
      <p className="text-[13px] text-muted leading-relaxed">{t('documents.subtitle')}</p>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm divide-y divide-black/[0.05]">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-[9px] bg-[#E3F2ED] flex items-center justify-center flex-shrink-0 mt-0.5">
              {DOC_ICONS[i] ?? DOC_ICONS[0]}
            </div>
            <p className="text-[13px] leading-snug pt-1">{item}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FCF0DA] rounded-xl px-4 py-3 flex gap-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B4740C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <p className="text-[12px] text-[#B4740C] leading-relaxed">{t('documents.note')}</p>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-2xl text-base font-semibold hover:border-gray-300 transition-colors"
        >
          {t('documents.back')}
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark transition-colors"
        >
          {t('documents.next')}
        </button>
      </div>
    </div>
  );
}
