interface Props {
  checked: boolean;
  onChange: () => void;
}

export default function TermsCheckbox({ checked, onChange }: Props) {
  return (
    <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 accent-primary"
      />
      <span>
        I agree to the{' '}
        <a href="/terms" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
          Terms & Conditions
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
          Privacy Policy
        </a>
      </span>
    </label>
  );
}
