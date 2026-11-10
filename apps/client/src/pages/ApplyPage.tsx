import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StepIndicator from '../components/apply/StepIndicator';
import PetInfoStep, { type PetInfoData } from '../components/apply/PetInfoStep';
import DocumentsStep from '../components/apply/DocumentsStep';
import ReviewStep from '../components/apply/ReviewStep';

const EMPTY_FORM: PetInfoData = { name: '', species: '', breed: '', dob: '', microchip: '' };

export default function ApplyPage() {
  const { t } = useTranslation('apply');
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<PetInfoData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePetInfo = (data: PetInfoData) => {
    setForm(data);
    setStep(1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // ponytail: replace with POST /applications when endpoint exists
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="px-5 pt-[18px] pb-4 md:max-w-[520px] md:mx-auto md:px-10 md:pt-16">
        <div className="flex flex-col items-center text-center py-10">
          <div className="w-16 h-16 rounded-full bg-[#E3F2ED] flex items-center justify-center mb-5">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-[21px] font-bold font-display mb-2">{t('success.heading')}</h2>
          <p className="text-[13.5px] text-muted leading-relaxed mb-8">{t('success.subtitle')}</p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-primary text-white py-4 rounded-2xl text-base font-semibold hover:bg-primary-dark transition-colors"
            >
              {t('success.backHome')}
            </button>
            <button
              onClick={() => navigate('/pets')}
              className="w-full border-2 border-gray-200 text-gray-700 py-4 rounded-2xl text-base font-semibold hover:border-gray-300 transition-colors"
            >
              {t('success.viewStatus')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-[18px] pb-6 md:max-w-[520px] md:mx-auto md:px-10 md:pt-8">
      <h1 className="text-[22px] font-bold font-display mb-5">{t('title')}</h1>

      <StepIndicator current={step} />

      {step === 0 && (
        <PetInfoStep defaultValues={form} onNext={handlePetInfo} />
      )}
      {step === 1 && (
        <DocumentsStep onBack={() => setStep(0)} onNext={() => setStep(2)} />
      )}
      {step === 2 && (
        <ReviewStep
          data={form}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
