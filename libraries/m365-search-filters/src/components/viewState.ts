import {FilterViewState} from './types';
/** PnP replaces custom elements after selection; retain only ephemeral UI state per instance. */
const states=new Map<string,FilterViewState>();
export function filterViewState(instanceId:string):FilterViewState{
  let state=states.get(instanceId);
  if(!state){if(states.size>=64)states.delete(states.keys().next().value!);state={expanded:{},queries:{}};states.set(instanceId,state);}
  return state;
}
