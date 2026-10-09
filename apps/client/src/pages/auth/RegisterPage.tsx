import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { NIC_REGEX, NIC_REGEX_MESSAGE, SL_PHONE_REGEX, SL_PHONE_REGEX_MESSAGE } from '@petlanka/types';
import AddressFields, { type AddressValue } from '../../components/auth/AddressFields';
import TermsCheckbox from '../../components/auth/TermsCheckbox';
import PhoneInput from '../../components/auth/PhoneInput';
import FormField from '../../components/ui/FormField';
import { registerClient } from '../../services/api/auth';

interface RegisterForm {
  fullName: string;
  nic: string;
  phone: string;
  email: string;
  address: AddressValue;
  terms: boolean;
}

const EMPTY_ADDRESS: AddressValue = { province: '', district: '', city: '', streetAddress: '' };
const INPUT_CLS = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none';

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: {
      fullName: '',
      nic: '',
      phone: '',
      email: '',
      address: EMPTY_ADDRESS,
      terms: false,
    },
  });

  const onSubmit = handleSubmit(async ({ fullName, nic, address }) => {
    try {
      await registerClient({ fullName, nic, ...address });
      navigate('/', { replace: true });
    } catch {
      setError('root', { message: 'Registration failed. Please try again.' });
    }
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <FormField error={errors.fullName?.message}>
            <input
              type="text"
              placeholder="Full Name *"
              className={INPUT_CLS}
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
          </FormField>

          <FormField error={errors.nic?.message}>
            <input
              type="text"
              placeholder="NIC Number *"
              className={INPUT_CLS}
              {...register('nic', {
                required: 'NIC number is required',
                pattern: { value: NIC_REGEX, message: NIC_REGEX_MESSAGE },
              })}
            />
          </FormField>

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

          <FormField error={errors.email?.message}>
            <input
              type="email"
              placeholder="Email (optional)"
              className={INPUT_CLS}
              {...register('email', {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
              })}
            />
          </FormField>

          <FormField error={errors.address?.city?.message ?? errors.address?.province?.message ?? errors.address?.streetAddress?.message}>
            <Controller
              name="address"
              control={control}
              rules={{
                validate: (v) => {
                  if (!v.province) return 'Province is required';
                  if (!v.district) return 'District is required';
                  if (!v.city) return 'City is required';
                  if (!v.streetAddress) return 'Street address is required';
                  return true;
                },
              }}
              render={({ field }) => (
                <AddressFields value={field.value} onChange={field.onChange} />
              )}
            />
          </FormField>

          <FormField error={errors.terms?.message}>
            <Controller
              name="terms"
              control={control}
              rules={{ validate: (v) => v || 'Please accept the terms & conditions' }}
              render={({ field }) => (
                <TermsCheckbox checked={field.value} onChange={() => field.onChange(!field.value)} />
              )}
            />
          </FormField>

          {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? 'Creating account…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
