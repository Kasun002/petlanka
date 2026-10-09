import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { OtpIdentifierType, OtpVerifyRouteState } from '@petlanka/types';
import { SL_PHONE_REGEX, SL_PHONE_REGEX_MESSAGE } from '@petlanka/types';
import PhoneInput from '../../components/auth/PhoneInput';
import FormField from '../../components/ui/FormField';
import { requestOtp } from '../../services/api/auth';

interface LoginForm {
  phone: string;
  email: string;
}

const INPUT_CLS = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifierType, setIdentifierType] = useState<OtpIdentifierType>('phone');
  const [apiError, setApiError] = useState('');

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    defaultValues: { phone: '', email: '' },
  });

  const handleTypeChange = (t: OtpIdentifierType) => {
    setIdentifierType(t);
    setApiError('');
    reset({ phone: '', email: '' });
  };

  const onSubmit = handleSubmit(async (data) => {
    setApiError('');
    const identifier = identifierType === 'phone' ? data.phone : data.email;
    try {
      await requestOtp(identifierType === 'phone' ? { phone: identifier } : { email: identifier });
      navigate('/login/verify', { state: { identifier, type: identifierType } as OtpVerifyRouteState });
    } catch {
      setApiError('Failed to send code. Please try again.');
    }
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-1 text-sm text-gray-500">We'll send a one-time code to verify</p>
        </div>

        <div className="flex rounded-xl border-2 border-gray-200 overflow-hidden">
          {(['phone', 'email'] as OtpIdentifierType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTypeChange(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                identifierType === t ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'phone' ? 'Phone' : 'Email'}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {identifierType === 'phone' ? (
            <FormField error={errors.phone?.message}>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: 'Phone number is required',
                  validate: (v) => SL_PHONE_REGEX.test(v) || SL_PHONE_REGEX_MESSAGE,
                }}
                render={({ field }) => (
                  <PhoneInput value={field.value} onChange={field.onChange} />
                )}
              />
            </FormField>
          ) : (
            <FormField error={errors.email?.message}>
              <input
                type="email"
                placeholder="Email address"
                className={INPUT_CLS}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
              />
            </FormField>
          )}

          {apiError && <p className="text-sm text-red-500">{apiError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Sending…' : 'Send one-time code'}
          </button>
        </form>
      </div>
    </div>
  );
}
