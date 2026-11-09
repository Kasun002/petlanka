import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Application, AppStatus } from '../types/application';
import rawData from '../data/applications.json';
import ApplicationDetail from '../components/applications/ApplicationDetail';
import ReviewActions from '../components/applications/ReviewActions';

const data = rawData.list as Application[];

export default function ApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('applications');

  const app = data.find((a) => a.id === id);

  const [status, setStatus]  = useState<AppStatus>(app?.status ?? 'PENDING');
  const [notes,  setNotes]   = useState(app?.notes ?? '');

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted text-[13px]">
        Application not found.
      </div>
    );
  }

  const handleAction = (action: AppStatus) => setStatus(action);

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center gap-1.5 text-[13px] text-primary font-semibold hover:underline"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
          <path d="M9 3L4 7l5 4" />
        </svg>
        {t('review.back')}
      </button>

      <h2 className="text-[15px] font-bold">
        {t('review.title')} — {app.applicant}
      </h2>

      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <ApplicationDetail app={{ ...app, status, notes }} />
        </div>
        <div className="w-72 flex-shrink-0">
          <ReviewActions
            status={status}
            notes={notes}
            onNotesChange={setNotes}
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  );
}
