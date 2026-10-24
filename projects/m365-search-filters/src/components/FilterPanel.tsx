import * as React from 'react';
import { brandStyle } from '@mahesh/m365-search-brand';
import { FilterPanelProps } from './types';
import { FilterSection } from './FilterSection';
import { SelectedFilters } from './SelectedFilters';
import { filterStyles } from './filterStyles';
export const FilterPanel:React.FC<FilterPanelProps> = props => {
  const [mobileOpen,setMobileOpen] = React.useState(Boolean(props.viewState?.mobileOpen));
  const setOpen=(open:boolean):void=>{if(props.viewState)props.viewState.mobileOpen=open;setMobileOpen(open);};
  const root=React.useRef<HTMLDivElement>(null);
  const dialog = React.useRef<HTMLDialogElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const total = props.filters.reduce((n,f)=>n+f.values.filter(v=>v.selected).length,0);
  const localState=React.useRef<import('./types').FilterViewState>({expanded:{},queries:{}});
  const state=props.viewState||localState.current;
  const selection=JSON.stringify(props.filters.flatMap(f=>f.values.filter(v=>v.selected).map(v=>[f.filterName,v.value])).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
  if(state.appliedSelection===undefined&&props.filters.length)state.appliedSelection=props.filters.some(f=>f.canClear)?selection:'[]';
  const pending=selection!==(state.appliedSelection||'[]');
  const applied=Boolean(state.appliedSelection&&state.appliedSelection!=='[]');
  const [,refreshActions]=React.useReducer((n:number)=>n+1,0);
  React.useEffect(()=>{
    if (!mobileOpen || !dialog.current) return;
    const el=dialog.current;
    el.showModal();
    const media=window.matchMedia('(min-width: 761px)');
    const closeOnDesktop=():void=>{if(media.matches)setOpen(false);};
    closeOnDesktop();
    media.addEventListener('change',closeOnDesktop);
    return ()=>{media.removeEventListener('change',closeOnDesktop);el.close();trigger.current?.focus();};
  },[mobileOpen]);
  React.useEffect(()=>{
    const focus=props.viewState?.focus;
    if(!focus)return;
    const input=Array.from(root.current?.querySelectorAll<HTMLInputElement>('input[data-refiner-value]')||[]).find(e=>e.dataset.filterName===focus.filterName&&e.dataset.refinerValue===focus.value);
    input?.focus();
    if(props.viewState)props.viewState.focus=undefined;
  },[]);
  React.useEffect(()=>{
    if(state.pendingChipApply!==undefined&&state.pendingChipApply===selection){
      state.pendingChipApply=undefined;state.appliedSelection=selection;refreshActions();props.onApply();
    }
  },[selection,props.onApply]);
  const removeChip:FilterPanelProps['onChange']=(filter,value,selected)=>{
    const next=props.filters.flatMap(f=>f.values.filter(v=>v.selected&&!(f.filterName===filter.filterName&&v.value===value.value)).map(v=>[f.filterName,v.value])).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    state.pendingChipApply=JSON.stringify(next);
    props.onChange(filter,value,selected);
  };
  const actions = (<footer className="m365-filters-footer"><button data-action="apply" className={'m365-filters-primary'+(pending?' is-pending':'')} type="button" disabled={!pending} onClick={()=>{state.appliedSelection=selection;Object.keys(state.expanded).forEach(k=>state.expanded[k]=false);refreshActions();setOpen(false);props.onApply();}}>Apply</button><button className="m365-filters-link" type="button" disabled={!applied} onClick={()=>{state.appliedSelection='[]';refreshActions();props.onClear();}}>Clear</button></footer>);
  const content = <>
    <p className="m365-filters-guidance" role="status" aria-live="polite">{pending?'Selections ready to apply.':'Choose options to refine the directory.'}</p>
    <SelectedFilters filters={props.filters} onChange={removeChip}/>
    <div className="m365-filters-groups">{props.filters.map(f=><FilterSection key={f.filterName} filter={f} viewState={state} onChange={props.onChange} actions={actions}/>)}</div>
    {props.filters.length===0 && <p className="m365-filters-empty" role="status">No filters available for these results.</p>}

  </>;
  return <div ref={root} className="m365-search-brand m365-filters-root" style={brandStyle(props.themeVariant) as React.CSSProperties}>
    <style>{filterStyles}</style>
    <button ref={trigger} className="m365-filters-mobile-trigger" type="button" aria-haspopup="dialog" onClick={()=>setOpen(true)}>Filters{total>0?' ('+total+')':''}</button>
    <aside className="m365-filters-desktop" aria-label="Search filters">{!mobileOpen && content}</aside>
    {mobileOpen && <dialog ref={dialog} className="m365-filters-dialog" aria-label="Search filters" onCancel={e=>{e.preventDefault();setOpen(false);}} onClose={()=>{if(dialog.current?.isConnected)setOpen(false);}}>
      <button className="m365-filters-close" type="button" aria-label="Close filters" onClick={()=>setOpen(false)}>×</button>{content}
    </dialog>}
  </div>;
};
