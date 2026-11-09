import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FeeRow { species: string; newFee: string; renewalFee: string; transferFee: string }

const INITIAL: FeeRow[] = [
  { species: 'Dog', newFee: '2500', renewalFee: '1500', transferFee: '1000' },
  { species: 'Cat', newFee: '1500', renewalFee: '1000', transferFee: '800'  },
  { species: 'Other', newFee: '1000', renewalFee: '800', transferFee: '600' },
];

const inp = 'w-full h-9 rounded-[8px] border border-black/[0.12] px-3 text-[13px] bg-white focus:outline-none focus:border-primary text-right';

export default function FeesPanel() {
  const { t } = useTranslation('settings');
  const [rows, setRows] = useState<FeeRow[]>(INITIAL);

  const update = (i: number, field: keyof FeeRow, val: string) =>
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  return (
    <div className="p-6 max-w-2xl">
      <h3 className="text-[14px] font-bold mb-4">{t('fees.title')}</h3>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="text-[11.5px] font-semibold text-muted border-b border-black/[0.08]">
            <th className="py-2 text-left">{t('fees.species')}</th>
            <th className="py-2 px-3 text-right">{t('fees.newFee')}</th>
            <th className="py-2 px-3 text-right">{t('fees.renewalFee')}</th>
            <th className="py-2 px-3 text-right">{t('fees.transferFee')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.species} className="border-b border-black/[0.04]">
              <td className="py-3 pr-4 font-semibold text-gray-800">{row.species}</td>
              <td className="py-3 px-3"><input className={inp} value={row.newFee}      onChange={(e) => update(i, 'newFee',      e.target.value)} /></td>
              <td className="py-3 px-3"><input className={inp} value={row.renewalFee}  onChange={(e) => update(i, 'renewalFee',  e.target.value)} /></td>
              <td className="py-3 px-3"><input className={inp} value={row.transferFee} onChange={(e) => update(i, 'transferFee', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-5 h-10 px-6 rounded-xl bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity">
        {t('fees.save')}
      </button>
    </div>
  );
}
