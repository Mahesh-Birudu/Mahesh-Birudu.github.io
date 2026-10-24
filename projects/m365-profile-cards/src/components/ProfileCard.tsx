import * as React from 'react';
import { ProfileProvider } from '../models/Profile';
import { useProfile } from '../hooks/useProfile';
import { usePresence } from '../hooks/usePresence';
import { PresenceBadge } from './PresenceBadge';
import { ProfilePhoto } from './ProfilePhoto';
import { ProfileDetailsDialog } from './ProfileDetailsDialog';
import { ProfileIcon } from './ProfileIcon';
import { profileStyles } from './profileStyles';
export interface ProfileCardProps { userId: string; provider: ProfileProvider; themeVariant?: { palette?: { themePrimary?: string } }; }
export const ProfileCard: React.FC<ProfileCardProps> = ({ userId, provider }) => {
  const { profile, photoUrl, loading, error, retry } = useProfile(userId, provider);
  const presence = usePresence(profile?.id, provider);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setOpen(false), [userId]);
  const name = profile?.displayName || 'Unnamed user';
  const email=profile?.mail||profile?.userPrincipalName||'Not provided';
  const phone=profile?.businessPhones?.filter(Boolean).join(', ')||profile?.mobilePhone||'Not provided';
  return <div className="m365-search-brand m365-directory-brand" aria-busy={loading}><style>{profileStyles}</style>
    <article className="m365-profile-card">
      {profile && <>
        <button ref={trigger} className="m365-profile-image-button m365-profile-open" type="button" aria-haspopup="dialog" aria-label={'View profile for '+name} onClick={()=>setOpen(true)}><ProfilePhoto name={name} url={photoUrl}/><span className="m365-profile-image-action"><ProfileIcon name="Contact"/> View profile</span></button>
        <div className="m365-profile-summary">
          <h3 className="m365-profile-name"><button type="button" onClick={()=>{trigger.current?.focus();setOpen(true);}} aria-label={'Profile details: '+name}><ProfileIcon name="Contact"/>{name}</button></h3>
          <p className="m365-profile-title">{profile.jobTitle||'Job title not provided'}</p>
          <p className="m365-profile-line" title={phone}><ProfileIcon name="Phone"/><span>{phone}</span></p>
          <p className="m365-profile-line" title={email}><ProfileIcon name="Mail"/><span>{email}</span></p>
          <div className="m365-profile-card-presence"><PresenceBadge {...presence}/></div>
        </div>
      </>}
      {(loading || error) && <p className="m365-profile-status" role="status" aria-live="polite">{loading ? 'Loading profile…' : error}</p>}
      {error && <button className="m365-profile-retry" type="button" onClick={retry}>Try again</button>}
    </article>
    {open && profile && <ProfileDetailsDialog photoUrl={photoUrl} returnFocus={trigger.current || undefined} profile={profile} presence={presence} onClose={() => setOpen(false)} />}
  </div>;
};
