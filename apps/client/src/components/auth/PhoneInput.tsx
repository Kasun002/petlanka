interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function PhoneInput({ value, onChange, placeholder = '77 123 4567' }: Props) {
  const digits = value.startsWith('+94') ? value.slice(3) : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    onChange(raw ? `+94${raw}` : '');
  };

  return (
    <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-primary overflow-hidden">
      <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm font-medium border-r border-gray-200 select-none">
        +94
      </span>
      <input
        type="tel"
        value={digits}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-3 py-3 text-sm focus:outline-none"
      />
    </div>
  );
}
