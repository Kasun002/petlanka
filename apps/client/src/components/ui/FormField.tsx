interface Props {
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ error, children }: Props) {
  return (
    <div>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
