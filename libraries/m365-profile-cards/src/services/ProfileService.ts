import { graphfi, GraphFI, SPFx } from '@pnp/graph';
import '@pnp/graph/users';
import '@pnp/graph/photos';
import '@pnp/graph/cloud-communications';
import { Presence } from '../models/Profile';
import { AadTokenProviderFactory } from '@microsoft/sp-http';
import { ServiceScope } from '@microsoft/sp-core-library';
import { Profile, ProfileProvider, ProfileError, normalizeIdentity } from '../models/Profile';

/** Scoped to the SPFx service scope; no tenant IDs, passwords, app secrets, or persistent PII cache. */
export class ProfileService implements ProfileProvider {
  private readonly graph: GraphFI;
  private readonly profiles = new Map<string, { expires: number; value: Promise<Profile> }>();
  private readonly photos = new Map<string, { expires: number; value: Promise<Blob | undefined> }>();
  public constructor(scope: ServiceScope) {
    this.graph = graphfi().using(SPFx({ aadTokenProviderFactory: scope.consume(AadTokenProviderFactory.serviceKey) }));
  }
  public getProfile(identity: string): Promise<Profile> {
    const key = normalizeIdentity(identity);
    return this.cached(this.profiles, key, async () => {
      try {
        // Explicit projection avoids fetching unrelated directory data.
        return await this.graph.users.getById(encodeURIComponent(key)).select('id', 'displayName', 'userPrincipalName', 'mail', 'jobTitle', 'department', 'companyName', 'businessPhones', 'mobilePhone', 'officeLocation', 'city', 'state', 'country', 'postalCode', 'streetAddress')<Profile>();
      } catch (error) { throw new ProfileError((error as { status?: number }).status || 0); }
    });
  }
  public getPhoto(identity: string): Promise<Blob | undefined> {
    const key = normalizeIdentity(identity);
    return this.cached(this.photos, key, async () => {
      try { return await this.graph.users.getById(encodeURIComponent(key)).photo.getBlob(); }
      catch { return undefined; } // Missing or inaccessible photo must not hide a profile.
    });
  }
  public async getPresence(userId: string): Promise<Presence> {
    return this.graph.users.getById(encodeURIComponent(normalizeIdentity(userId))).presence();
  }
  private cached<T>(cache: Map<string, { expires: number; value: Promise<T> }>, key: string, load: () => Promise<T>): Promise<T> {
    const hit = cache.get(key);
    if (hit && hit.expires > Date.now()) return hit.value;
    const value = load().catch(error => { cache.delete(key); throw error; });
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    cache.set(key, { expires: Date.now() + 60000, value });
    return value;
  }
}
