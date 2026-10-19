import {FilterGroup} from './types';
/** PnP CLEAR_ALL clears one named field, despite its event name. */
export function clearFilterFields(target:EventTarget,eventName:string,instanceId:string,filters:FilterGroup[],filterName?:string):void {
  const names=filterName?[filterName]:filters.map(filter=>filter.filterName);
  // Capture a stable event target before PnP replaces the custom element.
  for(const name of new Set(names))target.dispatchEvent(new CustomEvent(eventName,{detail:{instanceId,filterName:name},bubbles:true,cancelable:true}));
}
