interface Props {
  message: string;
}

export default function EmptyState({ message }: Readonly<Props>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mb-3">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#9A968A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block">
          <circle cx="11" cy="11" r="8" />
          <path d="M11 7v4M11 15h.01" />
        </svg>
      </div>
      <p className="text-[13px] text-muted">{message}</p>
    </div>
  );
}
