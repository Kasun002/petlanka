interface Props {
  total: number;
  perPage: number;
  current: number;
  onChange: (page: number) => void;
}

export default function Pagination({ total, perPage, current, onChange }: Readonly<Props>) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
    if (current < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btn = 'w-8 h-8 rounded-lg text-[12.5px] font-medium flex items-center justify-center transition-colors';

  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/[0.06]">
      <p className="text-[12px] text-muted">
        {(current - 1) * perPage + 1}–{Math.min(current * perPage, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className={`${btn} ${current === 1 ? 'text-muted cursor-not-allowed' : 'text-gray-700 hover:bg-surface'}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
            <path d="M9 3L4 7l5 4" />
          </svg>
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-[12.5px] text-muted">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`${btn} ${p === current ? 'bg-primary text-white' : 'text-gray-700 hover:bg-surface'}`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(current + 1)}
          disabled={current === totalPages}
          className={`${btn} ${current === totalPages ? 'text-muted cursor-not-allowed' : 'text-gray-700 hover:bg-surface'}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
            <path d="M5 3l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
