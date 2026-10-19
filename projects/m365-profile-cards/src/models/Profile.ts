export interface Profile {
  id: string;
  displayName: string;
  userPrincipalName?: string;
  mail?: string;
  jobTitle?: string;
  department?: string;
  companyName?: string;
  businessPhones?: string[];
  mobilePhone?: string;
  officeLocation?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  streetAddress?: string;
}
export interface ProfileProvider {
  getPresence?(userId: string): Promise<Presence>;
  getProfile(identity: string): Promise<Profile>;
  getPhoto(identity: string): Promise<Blob | undefined>;
}
export interface Presence { availability?: string; activity?: string; }
export function presenceDisplay(presence?: Presence): { state: string; label: string } {
  const states: Record<string, { state: string; label: string }> = {
    Available: { state: 'available', label: 'Available (online)' },
    AvailableIdle: { state: 'away', label: 'Available, idle' },
    Busy: { state: 'busy', label: 'Busy' }, BusyIdle: { state: 'busy', label: 'Busy, idle' },
    DoNotDisturb: { state: 'dnd', label: 'Do not disturb' },
    Away: { state: 'away', label: 'Away' }, BeRightBack: { state: 'away', label: 'Be right back' },
    Offline: { state: 'offline', label: 'Offline / appear offline' }
  };
  const base = states[presence?.availability || ''];
  if (!base) return { state: 'unknown', label: 'Presence unavailable' };
  const activities: Record<string, string> = { InACall: 'In a call', InAMeeting: 'In a meeting', Presenting: 'Presenting', Focusing: 'Focusing', OutOfOffice: 'Out of office' };
  return { state: base.state, label: activities[presence?.activity || ''] || base.label };
}
export class ProfileError extends Error {
  public constructor(public readonly status: number) {
    super(status === 403 || status === 401 ? 'Profile access is unavailable. Ask your administrator to check Microsoft Graph permissions.' : status === 404 ? 'This person could not be found in the directory.' : status === 429 ? 'The directory is busy. Try again shortly.' : 'The profile could not be loaded. Try again.');
    this.name = 'ProfileError';
  }
}
/** Accept an Entra object ID, UPN, or SharePoint membership claim. Never use display name as identity. */
export function normalizeIdentity(value: string): string {
  const identity = (value || '').trim().split('|').pop()!.trim();
  if (!identity || identity.length > 320 || /[\s/\\?\u0000-\u001f]/.test(identity)) throw new Error('A valid user ID or user principal name is required.');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identity) && !/^[^@]+@[^@]+\.[^@]+$/.test(identity)) throw new Error('Use a user principal name or Entra object ID.');
  return identity;
}
