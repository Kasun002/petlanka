interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

// Default className is h-9; pass className="h-10 w-full" for form contexts
export default function SelectInput({ className = 'h-9', children, ...props }: Readonly<Props>) {
  return (
    <div className="relative inline-block">
      <select
        {...props}
        className={`rounded-[9px] border border-black/[0.12] pl-3 pr-8 text-[13px] bg-white appearance-none focus:outline-none focus:border-primary ${className}`}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 block"
        width="11" height="11" viewBox="0 0 11 11"
        fill="none" stroke="#9A968A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M1.5 3.5l4 4 4-4" />
      </svg>
    </div>
  );
}
