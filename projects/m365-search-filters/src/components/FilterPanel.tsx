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
  const pending = props.filters.some(f=>f.canApply);
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
  const content = <>
    <header className="m365-filters-header"><div><p className="m365-filters-eyebrow">REFINE YOUR RESULTS</p><h2>Filters{total>0 && <span className="m365-filters-badge">{total}</span>}</h2></div>
      <button className="m365-filters-link" type="button" disabled={!total} onClick={()=>props.onClear()}>Clear all</button>
    </header>
    <SelectedFilters filters={props.filters} onChange={props.onChange}/>
    <div className="m365-filters-groups">{props.filters.map(f=><FilterSection key={f.filterName} filter={f} viewState={props.viewState} onChange={props.onChange}/>)}</div>
    {props.filters.length===0 && <p className="m365-filters-empty" role="status">No filters available for these results.</p>}
    <footer className="m365-filters-footer"><p role="status" aria-live="polite">{pending?'Selections ready to apply.':'Choose options to refine the directory.'}</p><button className="m365-filters-primary" type="button" disabled={!pending} onClick={()=>{setOpen(false);props.onApply();}}>Apply filters</button></footer>
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
