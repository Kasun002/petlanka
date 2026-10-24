interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder }: Readonly<Props>) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 block" width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#9A968A" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="8" cy="8" r="5" />
        <path d="m14 14-2.5-2.5" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-[9px] border border-black/[0.12] pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:border-primary w-[220px]"
      />
    </div>
  );
}
