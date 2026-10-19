import { Profile, ProfileError, ProfileProvider } from '../src/models/Profile';

/** Synthetic people only. No tenant data is used in the local preview. */
export const people: Profile[] = [
  { id: 'jenny@example.test', userPrincipalName: 'jenny@example.test', displayName: 'Jenny Wilson', mail: 'jenny@example.test', jobTitle: 'Chief Executive Officer', companyName: 'Contoso Studio', department: 'Leadership', businessPhones: ['+1 555 010 0123'], mobilePhone: '+1 555 010 0456', officeLocation: 'Seattle · HQ', city: 'Seattle', country: 'United States' },
  { id: 'alex@example.test', userPrincipalName: 'alex@example.test', displayName: 'Alex Morgan', mail: 'alex@example.test', jobTitle: 'SharePoint Developer', companyName: 'Contoso Studio', department: 'Digital Workplace', businessPhones: ['+1 555 010 0789'], officeLocation: 'Remote' },
  { id: 'sam@example.test', userPrincipalName: 'sam@example.test', displayName: 'Sam Lee', jobTitle: '', companyName: '' },
  { id: 'denied@example.test', displayName: 'Restricted profile' }
];
export class MockProfileProvider implements ProfileProvider {
  public async getPresence(identity: string) {
    return identity.startsWith('jenny') ? { availability: 'Available' } : identity.startsWith('alex') ? { availability: 'Busy', activity: 'InAMeeting' } : { availability: 'Offline' };
  }
  public async getProfile(identity: string): Promise<Profile> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (identity === 'denied@example.test') throw new ProfileError(403);
    const profile = people.find(person => person.id === identity);
    if (!profile) throw new ProfileError(404);
    return profile;
  }
  public async getPhoto(): Promise<undefined> { return undefined; }
}
