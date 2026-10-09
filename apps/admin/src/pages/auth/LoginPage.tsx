import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/auth/PasswordInput';
import FormField from '../../components/ui/FormField';
import { adminLogin } from '../../services/api/auth';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginForm {
  email: string;
  password: string;
}

const INPUT_CLS = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginForm>({ defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      const res = await adminLogin({ email, password });
      setAuth(
        { id: res.admin.id, type: 'admin', role: res.admin.role },
        { accessToken: res.accessToken, refreshToken: res.refreshToken },
      );
      navigate('/', { replace: true });
    } catch {
      setError('root', { message: 'Invalid email or password' });
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-primary-dark px-6 py-4">
        <span className="text-white text-lg font-bold tracking-wide">PetLanka Admin</span>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">Admin panel access</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <FormField error={errors.email?.message}>
              <input
                type="email"
                placeholder="Work email"
                className={INPUT_CLS}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
              />
            </FormField>

            <FormField error={errors.password?.message}>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                }}
                render={({ field }) => (
                  <PasswordInput value={field.value} onChange={field.onChange} />
                )}
              />
            </FormField>

            {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-dark text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
