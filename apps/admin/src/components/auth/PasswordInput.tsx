import { useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function PasswordInput({ value, onChange, placeholder = 'Password' }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-primary overflow-hidden">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-3 text-sm focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="px-3 text-gray-400 hover:text-gray-600"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}
