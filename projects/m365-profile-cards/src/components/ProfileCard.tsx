import * as React from 'react';
import { ProfileProvider } from '../models/Profile';
import { useProfile } from '../hooks/useProfile';
import { usePresence } from '../hooks/usePresence';
import { PresenceBadge } from './PresenceBadge';
import { ProfilePhoto } from './ProfilePhoto';
import { ProfileDetailsDialog } from './ProfileDetailsDialog';
import { profileStyles } from './profileStyles';
export interface ProfileCardProps { userId: string; provider: ProfileProvider; themeVariant?: { palette?: { themePrimary?: string } }; }
export const ProfileCard: React.FC<ProfileCardProps> = ({ userId, provider, themeVariant }) => {
  const { profile, photoUrl, loading, error, retry } = useProfile(userId, provider);
  const presence = usePresence(profile?.id, provider);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setOpen(false), [userId]);
  const name = profile?.displayName || 'Unnamed user';
  const style = themeVariant?.palette?.themePrimary ? { '--profile-accent': themeVariant.palette.themePrimary } as React.CSSProperties : undefined;
  return <div style={style} aria-busy={loading}><style>{profileStyles}</style>
    <article className="m365-profile-card">
      {profile && <><div className="m365-profile-main"><ProfilePhoto name={name} url={photoUrl} /><div className="m365-profile-summary">
        <h3 className="m365-profile-name">{name}</h3><PresenceBadge {...presence} />
        <p className="m365-profile-title">{profile.jobTitle || 'Job title not provided'}</p>
        <p className="m365-profile-line">{profile.mail || profile.userPrincipalName || 'Not provided'}</p>
        <p className="m365-profile-line">{profile.businessPhones?.filter(Boolean).join(', ') || profile.mobilePhone || 'Not provided'}</p>
      </div></div><div className="m365-profile-footer"><span className="m365-profile-company">{profile.companyName || 'Not provided'}</span>
        <button ref={trigger} className="m365-profile-open" type="button" aria-haspopup="dialog" aria-label={'View profile for ' + name} onClick={() => setOpen(true)}>View profile</button></div></>}
      {(loading || error) && <p className="m365-profile-status" role="status" aria-live="polite">{loading ? 'Loading profile…' : error}</p>}
      {error && <button className="m365-profile-retry" type="button" onClick={retry}>Try again</button>}
    </article>
    {open && profile && <ProfileDetailsDialog returnFocus={trigger.current || undefined} profile={profile} presence={presence} onClose={() => setOpen(false)} />}
  </div>;
};
