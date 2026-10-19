import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseWebComponent, ExtensibilityConstants } from '@pnp/modern-search-extensibility';
import { FilterPanel } from '../components/FilterPanel';
import { FilterSection } from '../components/FilterSection';
import { FilterGroup,FilterValue,FilterPanelProps } from '../components/types';
import { brandStyle } from '@mahesh/m365-search-brand';
import { filterStyles } from '../components/filterStyles';
import {filterViewState} from '../components/viewState';
interface Attributes extends Partial<FilterPanelProps> {instanceId?:string;filter?:FilterGroup;}
/** React owns markup; only documented PnP filter events cross the host boundary. */
export class SearchFiltersWebComponent extends BaseWebComponent {
  public static get observedAttributes():string[]{return ['data-filters','data-instance-id','data-theme-variant'];}
  public connectedCallback():void{this.renderControl();}
  public attributeChangedCallback():void{if(this.isConnected)this.renderControl();}
  public disconnectedCallback():void{ReactDOM.unmountComponentAtNode(this);}
  protected emit(name:string,detail:Record<string,unknown>):void{this.dispatchEvent(new CustomEvent(name,{detail,bubbles:true,cancelable:true}));}
  protected change(instanceId:string|undefined,filter:FilterGroup,value:FilterValue,selected:boolean):void{
    if(!instanceId)return;
    this.emit(ExtensibilityConstants.EVENT_FILTER_UPDATED,{instanceId,filterName:filter.filterName,filterValues:[{name:value.name,value:value.value,operator:value.operator,selected}]});
  }
  protected renderControl():void{
    const a=this.resolveAttributes() as Attributes;
    if(!a.instanceId){ReactDOM.render(<p role="status">Register this library in PnP Search Filters to connect the controls.</p>,this);return;}
    ReactDOM.render(<FilterPanel filters={Array.isArray(a.filters)?a.filters:[]} themeVariant={a.themeVariant} viewState={filterViewState(a.instanceId)}
      onChange={(f,v,s)=>this.change(a.instanceId,f,v,s)}
      onApply={()=>this.emit(ExtensibilityConstants.EVENT_FILTER_APPLY_ALL,{instanceId:a.instanceId})}
      onClear={filterName=>this.emit(ExtensibilityConstants.EVENT_FILTER_CLEAR_ALL,{instanceId:a.instanceId,filterName})}/>,this);
  }
}
/** Reusable option control when authors prefer PnP's builtin layouts. */
export class FilterOptionsWebComponent extends SearchFiltersWebComponent {
  public static get observedAttributes():string[]{return ['data-filter','data-instance-id','data-theme-variant'];}
  protected renderControl():void{
    const a=this.resolveAttributes() as Attributes;
    if(!a.filter||!a.instanceId)return;
    ReactDOM.render(<div className="m365-filters-root" style={brandStyle(a.themeVariant) as React.CSSProperties}><style>{filterStyles}</style><FilterSection filter={a.filter} viewState={filterViewState(a.instanceId)} onChange={(f,v,s)=>this.change(a.instanceId,f,v,s)}/></div>,this);
  }
}
