import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ProfileCard } from '../src/components/ProfileCard';
import { MockProfileProvider } from './fixtures';
const provider = new MockProfileProvider();
class PreviewCard extends HTMLElement {
  public connectedCallback(): void { ReactDOM.render(React.createElement(ProfileCard, { userId: this.getAttribute('data-user-id') || '', provider }), this); }
  public disconnectedCallback(): void { ReactDOM.unmountComponentAtNode(this); }
}
customElements.define('m365-profile-details', PreviewCard);
