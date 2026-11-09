interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: Readonly<Props>) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-black/5 ${className}`}>
      {children}
    </div>
  );
}
