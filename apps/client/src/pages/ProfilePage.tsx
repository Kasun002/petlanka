import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import profileData from '../data/profile.json';
import type { UserProfile } from '../types/profile';
import ProfileInfoCard from '../components/profile/ProfileInfoCard';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';

export default function ProfilePage() {
  const { t } = useTranslation('profile');
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>(profileData as UserProfile);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initials = profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const handleSave = (data: UserProfile) => {
    setIsSaving(true);
    // ponytail: replace with PATCH /profile when endpoint exists
    setTimeout(() => {
      setProfile(data);
      setIsSaving(false);
      setEditing(false);
    }, 600);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/', { replace: true });
  };

  return (
    <div className="px-5 pt-[18px] pb-6 md:max-w-[720px] md:mx-auto md:px-10 md:pt-8">
      {/* Avatar + name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-[64px] h-[64px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-[20px] flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-[20px] font-bold font-display">{profile.fullName}</h1>
          <p className="text-[12.5px] text-muted mt-0.5">{profile.phone}</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="ml-auto flex items-center gap-1.5 text-primary text-[13px] font-semibold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/>
            </svg>
            {t('edit')}
          </button>
        )}
      </div>

      {editing ? (
        <ProfileEditForm
          defaultValues={profile}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          isSaving={isSaving}
        />
      ) : (
        <div className="space-y-4">
          <ProfileInfoCard profile={profile} />

          {/* Language */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm px-4 py-3.5 flex items-center justify-between">
            <span className="text-[13.5px] font-medium">{t('language')}</span>
            <LanguageSwitcher />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-100 text-[#C0362C] font-semibold text-[13.5px] hover:bg-red-50 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="block">
              <path d="M10 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/>
              <path d="M16 17l5-5-5-5"/><path d="M21 12H10"/>
            </svg>
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}
