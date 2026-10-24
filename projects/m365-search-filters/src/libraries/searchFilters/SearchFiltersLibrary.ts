import { ServiceKey } from '@microsoft/sp-core-library';
import { BaseLayout,IExtensibilityLibrary,IComponentDefinition,ILayoutDefinition,LayoutType,IFilterControlDefinition,FilterType } from '@pnp/modern-search-extensibility';
import { SearchFiltersWebComponent,FilterOptionsWebComponent } from '../../webComponents/SearchFiltersWebComponent';
class SoftFiltersLayout extends BaseLayout<Record<string,never>> {}
export const filterTemplate='<content id="data-content"><m365-search-filters data-instance-id="{{instanceId}}" data-filters="{{JSONstringify filters}}" data-theme-variant="{{JSONstringify theme}}"></m365-search-filters></content>';
export class SearchFiltersLibrary implements IExtensibilityLibrary {
  public getCustomWebComponents():IComponentDefinition<unknown>[]{return [
    {componentName:'m365-search-filters',componentClass:SearchFiltersWebComponent},
    {componentName:'m365-filter-options',componentClass:FilterOptionsWebComponent}
  ];}
  public getCustomLayouts():ILayoutDefinition[]{return [{name:'M365 • Soft filter panel',key:'M365SoftFilters',type:LayoutType.Filter,iconName:'Filter',templateContent:filterTemplate,serviceKey:ServiceKey.create('M365:SoftFiltersLayout',SoftFiltersLayout)}];}
  public getCustomFilterControls():IFilterControlDefinition[]{return [{key:'M365SoftOptions',name:'M365 • Soft checkbox options',componentName:'m365-filter-options',filterType:FilterType.Refiner,showApplyButtons:true,showOperator:false,supportsMultiValues:true,supportsValuesCount:true}];}
  public getCustomSuggestionProviders():[]{return [];}
  public getCustomQueryModifiers():[]{return [];}
  public getCustomDataSources():[]{return [];}
  public invokeCardAction():void{/* No adaptive card actions. */}
  public name():string{return 'SearchFiltersLibrary';}
}
