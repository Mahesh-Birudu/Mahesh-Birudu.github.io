import * as React from 'react';
import { Profile, ProfileProvider, normalizeIdentity } from '../models/Profile';
export function useProfile(identity: string, provider: ProfileProvider) {
  const [profile, setProfile] = React.useState<Profile>();
  const [photoUrl, setPhotoUrl] = React.useState<string>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>();
  const [revision, setRevision] = React.useState(0);
  React.useEffect(() => {
    let active = true; let objectUrl: string | undefined;
    setProfile(undefined); setPhotoUrl(undefined); setError(undefined); setLoading(true);
    void (async () => {
      try {
        const key = normalizeIdentity(identity);
        const value = await provider.getProfile(key);
        if (!active) return;
        setProfile(value); setLoading(false);
        // A missing or inaccessible photo must not replace a usable profile with an error.
        try {
          const photo = await provider.getPhoto(key);
          if (active && photo?.type.startsWith('image/')) {
            objectUrl = URL.createObjectURL(photo); setPhotoUrl(objectUrl);
          }
        } catch { /* Initials remain visible. */ }
      } catch (failure) {
        if (active) { setLoading(false); setError(failure instanceof Error ? failure.message : 'The profile could not be loaded.'); }
      }
    
    })();
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [identity, provider, revision]);
  return { profile, photoUrl, loading, error, retry: () => setRevision(value => value + 1) };
}

