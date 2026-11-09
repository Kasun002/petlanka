import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function OtpInput({ value, onChange }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const chars = value.split('');
    chars[i] = char;
    onChange(chars.join('').slice(0, 6));
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
        />
      ))}
    </div>
  );
}
