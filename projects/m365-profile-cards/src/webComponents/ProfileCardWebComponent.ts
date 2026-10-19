import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent } from '@pnp/modern-search-extensibility';
import { ServiceScope } from '@microsoft/sp-core-library';
import { ProfileService } from '../services/ProfileService';
import { ProfileCard, ProfileCardProps } from '../components/ProfileCard';
const providers = new WeakMap<ServiceScope, ProfileService>();
/** PnP supplies attributes and ServiceScope; React owns all card and popup markup. */
export class ProfileCardWebComponent extends BaseWebComponent {
  private generation = 0;
  public static get observedAttributes(): string[] { return ['data-user-id', 'data-theme-variant']; }
  public connectedCallback(): void { this.mount(); }
  public attributeChangedCallback(): void { if (this.isConnected) this.mount(); }
  private mount(): void {
    const generation = ++this.generation;
    const scope = this._serviceScope as ServiceScope;
    if (!scope) { ReactDOM.render(React.createElement('p', { role: 'status' }, 'Register this library in PnP Search Results before using profile cards.'), this); return; }
    scope.whenFinished(() => {
      if (!this.isConnected || generation !== this.generation) return;
      let provider = providers.get(scope);
      if (!provider) { provider = new ProfileService(scope); providers.set(scope, provider); }
      const attributes = this.resolveAttributes() as Partial<ProfileCardProps>;
      ReactDOM.render(React.createElement(ProfileCard, { userId: String(attributes.userId || ''), themeVariant: attributes.themeVariant, provider, key: String(attributes.userId || '') }), this);
    });
  }
  public disconnectedCallback(): void { this.generation++; ReactDOM.unmountComponentAtNode(this); }
}
/** Compatibility alias for existing templates while they migrate to m365-profile-details. */
export class LegacyProfileCardWebComponent extends ProfileCardWebComponent {}
