import { useTranslation } from 'react-i18next';

interface Props {
  checked: boolean;
  onChange: () => void;
}

export default function TermsCheckbox({ checked, onChange }: Props) {
  const { t } = useTranslation('auth');
  return (
    <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 accent-primary"
      />
      <span>
        {t('register.termsAgree')}{' '}
        <a href="/terms" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
          {t('register.termsLink')}
        </a>{' '}
        {t('register.and')}{' '}
        <a href="/privacy" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
          {t('register.privacyLink')}
        </a>
      </span>
    </label>
  );
}
