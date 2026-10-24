import * as React from 'react';
import { Profile } from '../models/Profile';
import { PresenceBadge, PresenceBadgeProps } from './PresenceBadge';
import { ProfilePhoto } from './ProfilePhoto';
import { ProfileIcon } from './ProfileIcon';
import { profileBanner } from './profileBanner';
interface Props { profile: Profile; presence: PresenceBadgeProps; photoUrl?:string; onClose: () => void; returnFocus?: HTMLElement; }
export const ProfileDetailsDialog: React.FC<Props> = ({ profile, presence, photoUrl, onClose, returnFocus }) => {
  const dialog = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const element = dialog.current!;
    const previous = returnFocus || (document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
    element.showModal();
    return () => { if (element.open) element.close(); if (previous?.isConnected) previous.focus(); };
  }, []);
  const email = profile.mail || profile.userPrincipalName || '';
  const phone=profile.businessPhones?.filter(Boolean).join(', ');
  const phoneLink=(value:string|undefined):React.ReactNode=>value?<a href={'tel:'+encodeURIComponent(value.replace(/[^+\d]/g,''))}>{value}</a>:undefined;
  const values:Array<{label:string;icon:string;value:React.ReactNode}>=[
    {label:'Teams status',icon:'SkypeCircleCheck',value:<PresenceBadge {...presence}/>},
    {label:'Email',icon:'Mail',value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?<a href={'mailto:'+encodeURIComponent(email)}>{email}</a>:email},
    {label:'Business phone',icon:'Phone',value:phoneLink(phone)},
    {label:'Mobile',icon:'CellPhone',value:phoneLink(profile.mobilePhone)},
    {label:'Company',icon:'CityNext',value:profile.companyName},
    {label:'Department',icon:'People',value:profile.department},
    {label:'Office',icon:'POI',value:profile.officeLocation},
    {label:'Address',icon:'MapPin',value:[profile.streetAddress,profile.city,profile.state,profile.postalCode,profile.country].filter(Boolean).join(', ')},
    {label:'User principal name',icon:'ContactInfo',value:profile.userPrincipalName}
  ];
  return <dialog ref={dialog} className="m365-profile-dialog m365-profile-panel" aria-label={'Profile details for '+profile.displayName}
    onCancel={event=>{event.preventDefault();onClose();}} onClose={()=>{if(dialog.current?.isConnected)onClose();}} onClick={event=>{if(event.target===dialog.current){const bounds=dialog.current!.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right)onClose();}}}>
    <header className="m365-profile-panel-banner" style={{backgroundImage:'url("'+profileBanner+'")'}}>
      <span className="m365-profile-panel-eyebrow">People directory</span>
      <button className="m365-profile-close" type="button" autoFocus aria-label="Close profile" onClick={onClose}><ProfileIcon name="ChromeClose"/></button>
      <div className="m365-profile-panel-avatar"><ProfilePhoto name={profile.displayName||'Unnamed user'} url={photoUrl}/></div>
    </header>
    <div className="m365-profile-panel-content">
      <div className="m365-profile-panel-identity"><h2>{profile.displayName||'Unnamed user'}</h2><p>{profile.jobTitle||'Job title not provided'}</p>{profile.companyName&&<span className="m365-profile-panel-company">{profile.companyName}</span>}</div>
      <dl className="m365-profile-details">{values.map(({label,icon,value})=><div className="m365-profile-detail-row" key={label}><ProfileIcon name={icon}/><div><dt>{label}</dt><dd>{value||'Not provided'}</dd></div></div>)}</dl>
    </div>
  </dialog>;
};
