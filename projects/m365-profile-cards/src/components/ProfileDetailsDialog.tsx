import * as React from 'react';
import { Profile } from '../models/Profile';
import { PresenceBadge, PresenceBadgeProps } from './PresenceBadge';
interface Props { profile: Profile; presence: PresenceBadgeProps; onClose: () => void; returnFocus?: HTMLElement; }
export const ProfileDetailsDialog: React.FC<Props> = ({ profile, presence, onClose, returnFocus }) => {
  const dialog = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const element = dialog.current!;
    const previous = returnFocus || (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
    element.showModal();
    return () => { if (element.open) element.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  const email = profile.mail || profile.userPrincipalName || '';
  const values: Array<[string, React.ReactNode]> = [
    ['Teams status', <PresenceBadge key="presence" {...presence} />], ['Company', profile.companyName],
    ['Department', profile.department], ['Email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? <a href={'mailto:' + encodeURIComponent(email)}>{email}</a> : email],
    ['Business phone', profile.businessPhones?.filter(Boolean).join(', ')], ['Mobile', profile.mobilePhone],
    ['Office', profile.officeLocation], ['Address', [profile.streetAddress, profile.city, profile.state, profile.postalCode, profile.country].filter(Boolean).join(', ')],
    ['User principal name', profile.userPrincipalName]
  ];
  return <dialog ref={dialog} className="m365-profile-dialog" aria-label={'Profile details for ' + profile.displayName}
    onCancel={event => { event.preventDefault(); onClose(); }} onClose={onClose}>
    <div className="m365-profile-dialog-header"><button className="m365-profile-close" type="button" autoFocus aria-label="Close profile" onClick={onClose}>×</button>
      <h2>{profile.displayName || 'Unnamed user'}</h2><p>{profile.jobTitle || 'Job title not provided'}</p></div>
    <dl className="m365-profile-details">{values.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></React.Fragment>)}</dl>
  </dialog>;
};
