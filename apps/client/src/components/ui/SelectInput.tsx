interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export default function SelectInput({ className = '', children, ...props }: Readonly<Props>) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={`w-full border-2 border-gray-200 rounded-xl pl-3 pr-10 py-3 text-sm bg-white appearance-none focus:border-primary focus:outline-none disabled:opacity-50 ${className}`}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        width="12" height="12" viewBox="0 0 11 11"
        fill="none" stroke="#9A968A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M1.5 3.5l4 4 4-4" />
      </svg>
    </div>
  );
}
