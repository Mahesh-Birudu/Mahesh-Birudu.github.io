import * as React from 'react';
export const ProfilePhoto: React.FC<{ name: string; url?: string }> = ({ name, url }) => {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [url]);
  const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  return <div className="m365-profile-photo-frame">{url && !failed
    ? <img className="m365-profile-photo" src={url} alt="" onError={() => setFailed(true)} />
    : <span className="m365-profile-initials" aria-hidden="true">{initials}</span>}</div>;
};
