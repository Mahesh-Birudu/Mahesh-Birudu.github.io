import { IExtensibilityLibrary, IComponentDefinition } from '@pnp/modern-search-extensibility';
import { ProfileCardWebComponent, LegacyProfileCardWebComponent } from '../../webComponents/ProfileCardWebComponent';

/** PnP Modern Search discovers this library using its manifest ID. */
export class ProfileCardsLibrary implements IExtensibilityLibrary {
  public getCustomWebComponents(): IComponentDefinition<unknown>[] {
    return [
      { componentName: 'm365-profile-details', componentClass: ProfileCardWebComponent },
      { componentName: 'm365-profile-card', componentClass: LegacyProfileCardWebComponent }
    ];
  }
  public getCustomLayouts(): [] { return []; }
  public getCustomSuggestionProviders(): [] { return []; }
  public getCustomFilterControls(): [] { return []; }
  public getCustomQueryModifiers(): [] { return []; }
  public getCustomDataSources(): [] { return []; }
  public invokeCardAction(): void { /* No adaptive card actions. */ }
  public name(): string { return 'ProfileCardsLibrary'; }
}
