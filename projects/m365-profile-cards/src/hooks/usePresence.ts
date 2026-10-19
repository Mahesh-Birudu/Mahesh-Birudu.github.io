import * as React from 'react';
import { ProfileProvider, presenceDisplay } from '../models/Profile';
export function usePresence(userId: string | undefined, provider: ProfileProvider) {
  const [display, setDisplay] = React.useState(presenceDisplay());
  React.useEffect(() => {
    let active = true; let timer: number | undefined;
    setDisplay(presenceDisplay());
    if (!userId || !provider.getPresence) return;
    const refresh = async (): Promise<void> => {
      if (document.visibilityState !== 'hidden') {
        let next = presenceDisplay();
        try { next = presenceDisplay(await provider.getPresence!(userId)); } catch { /* Unknown is never offline. */ }
        if (!active) return;
        setDisplay(next);
      }
      if (active) timer = window.setTimeout(() => { void refresh(); }, 60000);
    };
    void refresh();
    return () => { active = false; window.clearTimeout(timer); };
  }, [userId, provider]);
  return display;
}
