import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from '../../types/profile';
import FormField from '../ui/FormField';
import AddressFields from '../auth/AddressFields';

interface Props {
  defaultValues: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const INPUT_CLS = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none';

export default function ProfileEditForm({ defaultValues, onSave, onCancel, isSaving }: Readonly<Props>) {
  const { t } = useTranslation('profile');
  const { register, handleSubmit, control, formState: { errors } } = useForm<UserProfile>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-3">
      <FormField error={errors.fullName?.message}>
        <input
          type="text"
          placeholder={t('fullName')}
          className={INPUT_CLS}
          {...register('fullName', { required: `${t('fullName')} is required` })}
        />
      </FormField>

      <FormField>
        <input type="text" value={defaultValues.nic} readOnly className={`${INPUT_CLS} bg-surface text-muted cursor-not-allowed`} />
      </FormField>

      <FormField>
        <input type="tel" value={defaultValues.phone} readOnly className={`${INPUT_CLS} bg-surface text-muted cursor-not-allowed`} />
      </FormField>

      <FormField error={errors.email?.message}>
        <input
          type="email"
          placeholder={t('email')}
          className={INPUT_CLS}
          {...register('email', {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
          })}
        />
      </FormField>

      <FormField>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <AddressFields value={field.value} onChange={field.onChange} />
          )}
        />
      </FormField>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border-2 border-gray-200 text-gray-700 py-4 rounded-2xl text-base font-semibold hover:border-gray-300 transition-colors"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark disabled:opacity-60 transition-colors"
        >
          {isSaving ? t('saving') : t('save')}
        </button>
      </div>
    </form>
  );
}
