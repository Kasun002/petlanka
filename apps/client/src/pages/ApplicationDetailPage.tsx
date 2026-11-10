import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import applicationsData from '../data/applications.json';
import type { Application, AppStatus } from '../types/application';

const applications = applicationsData as Application[];

const STATUS_STYLE: Record<AppStatus, { bg: string; color: string; label: string }> = {
  PENDING:       { bg: '#FCF0DA', color: '#B4740C', label: 'Pending Review' },
  INFO_REQUIRED: { bg: '#FBE9E7', color: '#C0362C', label: 'Info Required' },
  APPROVED:      { bg: '#E5F5EC', color: '#1E8A5F', label: 'Approved' },
  REJECTED:      { bg: '#FBE9E7', color: '#C0362C', label: 'Rejected' },
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reply, setReply] = useState('');
  const [replySent, setReplySent] = useState(false);

  const app = applications.find((a) => a.id === id);
  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted text-[14px]">Application not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-semibold text-[13.5px]">← Go back</button>
      </div>
    );
  }

  const { bg, color, label } = STATUS_STYLE[app.status];

  const handleSendReply = () => {
    if (!reply.trim()) return;
    // ponytail: replace with POST /applications/:id/reply when endpoint exists
    setReplySent(true);
  };

  return (
    <div className="px-5 pt-4 pb-6 md:max-w-[720px] md:mx-auto md:px-10 md:pt-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-[13px] text-muted font-medium mb-5 hover:text-gray-700 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block flex-shrink-0">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Status header */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 mb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-[16px]">{app.petName}</p>
            <p className="text-[12px] text-muted mt-0.5">{app.petSpecies} · Application #{app.id}</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-[7px] flex-shrink-0" style={{ background: bg, color }}>
            {label}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-black/[0.06] flex gap-4 text-[11.5px] text-muted">
          <span>Submitted: {new Date(app.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span>Updated: {new Date(app.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Officer notes timeline */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 mb-3">
        <p className="font-bold text-[13.5px] mb-4">Officer Notes</p>
        <div className="space-y-4">
          {app.officerNotes.map((note, i) => (
            <div key={note.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#E3F2ED] flex items-center justify-center flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
                    <circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.4-3.6 4.3-5.5 7.5-5.5s6.1 1.9 7.5 5.5"/>
                  </svg>
                </div>
                {i < app.officerNotes.length - 1 && (
                  <div className="w-[1.5px] flex-1 mt-2 bg-gray-100" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-[11.5px] text-muted mb-1">
                  {new Date(note.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-[13px] leading-relaxed">{note.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Respond section — only for INFO_REQUIRED */}
      {app.status === 'INFO_REQUIRED' && (
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4">
          <p className="font-bold text-[13.5px] mb-3">Your Response</p>
          {replySent ? (
            <div className="flex items-center gap-2.5 py-3">
              <div className="w-8 h-8 rounded-full bg-[#E3F2ED] flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F7A63" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="block">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[13px] text-muted">Response sent. The officer will review it shortly.</p>
            </div>
          ) : (
            <>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="Describe what you're providing or any additional information the officer requested…"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:border-primary focus:outline-none resize-none"
              />
              <button
                onClick={handleSendReply}
                disabled={!reply.trim()}
                className="mt-3 w-full bg-primary text-white py-3.5 rounded-xl text-[13.5px] font-semibold hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                Send Response
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
