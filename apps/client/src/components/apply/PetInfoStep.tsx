import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { PetSpecies } from '../../types/pet';
import FormField from '../ui/FormField';
import SelectInput from '../ui/SelectInput';

export interface PetInfoData {
  name: string;
  species: PetSpecies | '';
  breed: string;
  dob: string;
  microchip: string;
}

interface Props {
  defaultValues: PetInfoData;
  onNext: (data: PetInfoData) => void;
}

const SPECIES: PetSpecies[] = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];
const INPUT_CLS = 'w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none';

export default function PetInfoStep({ defaultValues, onNext }: Readonly<Props>) {
  const { t } = useTranslation('apply');
  const { register, handleSubmit, control, formState: { errors } } = useForm<PetInfoData>({ defaultValues });

  // SelectInput uses native select — integrate with react-hook-form via register
  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-[17px] font-bold mb-1">{t('petInfo.heading')}</h2>

      <FormField error={errors.name?.message}>
        <input
          type="text"
          placeholder={t('petInfo.name')}
          className={INPUT_CLS}
          {...register('name', { required: t('petInfo.nameRequired') })}
        />
      </FormField>

      <FormField error={errors.species?.message}>
        <SelectInput
          className="h-[50px] w-full"
          {...register('species', { required: t('petInfo.speciesRequired') })}
        >
          <option value="">{t('selectSpecies')}</option>
          {SPECIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </SelectInput>
      </FormField>

      <FormField error={errors.breed?.message}>
        <input
          type="text"
          placeholder={t('petInfo.breed')}
          className={INPUT_CLS}
          {...register('breed', { required: t('petInfo.breedRequired') })}
        />
      </FormField>

      <FormField error={errors.dob?.message}>
        <input
          type="date"
          className={INPUT_CLS}
          {...register('dob', { required: t('petInfo.dobRequired') })}
        />
      </FormField>

      <FormField>
        <input
          type="text"
          placeholder={t('petInfo.microchip')}
          className={INPUT_CLS}
          {...register('microchip')}
        />
      </FormField>

      <button
        type="submit"
        className="w-full bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark transition-colors mt-2"
      >
        {t('petInfo.next')}
      </button>
    </form>
  );
}
