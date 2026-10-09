import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import type { OtpVerifyRouteState } from '@petlanka/types';
import OtpInput from '../../components/auth/OtpInput';
import FormField from '../../components/ui/FormField';
import { verifyOtp, requestOtp } from '../../services/api/auth';
import { useAuth } from '../../context/AuthContext';

interface OtpForm {
  code: string;
}

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const routeState = location.state as OtpVerifyRouteState | null;

  const [apiError, setApiError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<OtpForm>({
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (!routeState) navigate('/login', { replace: true });
  }, [routeState, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  if (!routeState) return null;

  const onSubmit = handleSubmit(async ({ code }) => {
    setApiError('');
    try {
      const res = await verifyOtp(
        routeState.type === 'phone'
          ? { phone: routeState.identifier, code }
          : { email: routeState.identifier, code },
      );
      // ponytail: id is empty until a /me endpoint exists — sub is in the JWT but not decoded here
      setAuth({ id: '', type: 'client' }, { accessToken: res.accessToken, refreshToken: res.refreshToken });
      navigate(res.isNewUser ? '/register' : '/', { replace: true });
    } catch {
      setApiError('Invalid or expired code. Please try again.');
    }
  });

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      await requestOtp(
        routeState.type === 'phone'
          ? { phone: routeState.identifier }
          : { email: routeState.identifier },
      );
      setResendCooldown(60);
    } catch {
      setApiError('Failed to resend. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verify code</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-gray-700">{routeState.identifier}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <FormField error={errors.code?.message}>
            <Controller
              name="code"
              control={control}
              rules={{
                required: 'Enter the 6-digit code',
                minLength: { value: 6, message: 'Enter all 6 digits' },
              }}
              render={({ field }) => (
                <OtpInput value={field.value} onChange={field.onChange} />
              )}
            />
          </FormField>

          {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Verifying…' : 'Verify & continue'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-primary disabled:text-gray-400"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
          </button>
        </div>
      </div>
    </div>
  );
}
