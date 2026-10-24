import * as React from 'react';
import { FilterGroup, FilterValue,FilterViewState } from './types';
export const FilterSection:React.FC<{filter:FilterGroup;viewState?:FilterViewState;actions?:React.ReactNode;onChange:(f:FilterGroup,v:FilterValue,s:boolean)=>void}> = ({filter,onChange,viewState,actions}) => {
  const [expanded,setExpanded] = React.useState(viewState?.expanded[filter.filterName]??false);
  const [query,setQuery] = React.useState(viewState?.queries[filter.filterName]||'');
  const root=React.useRef<HTMLElement>(null);const trigger=React.useRef<HTMLButtonElement>(null);
  const optionsId = React.useRef('m365-options-'+Math.random().toString(36).slice(2));
  const close=():void=>{if(viewState)viewState.expanded[filter.filterName]=false;setExpanded(false);};
  React.useEffect(()=>{
    if(!expanded)return;
    const outside=(event:PointerEvent):void=>{if(!root.current?.contains(event.target as Node))close();};
    const escape=(event:KeyboardEvent):void=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();trigger.current?.focus();}};
    document.addEventListener('pointerdown',outside);root.current?.addEventListener('keydown',escape);
    const element=root.current;
    return()=>{document.removeEventListener('pointerdown',outside);element?.removeEventListener('keydown',escape);};
  },[expanded]);
  const localOrder=React.useRef<string[]>([]);
  if(viewState&&!viewState.optionOrder)viewState.optionOrder={};
  const order=viewState?(viewState.optionOrder![filter.filterName]||(viewState.optionOrder![filter.filterName]=[])):localOrder.current;
  for(const value of filter.values)if(!order.includes(value.value))order.push(value.value);
  const rank=new Map(order.map((value,index)=>[value,index]));
  const ordered=filter.values.slice().sort((a,b)=>rank.get(a.value)!-rank.get(b.value)!);
  const visible = ordered.filter(v=>v.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const selected = filter.values.filter(v=>v.selected).length;
  return <section ref={root} className="m365-filters-section">
    <button ref={trigger} className="m365-filters-heading" type="button" aria-haspopup="dialog" aria-expanded={expanded} aria-controls={optionsId.current} onClick={()=>{if(viewState)viewState.expanded[filter.filterName]=!expanded;setExpanded(!expanded);}}>
      <span>{filter.displayName}{selected>0 && <span className="m365-filters-badge">{selected}</span>}</span>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{transform:expanded?'rotate(180deg)':undefined}}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    <div id={optionsId.current} hidden={!expanded} className="m365-filters-options" role="dialog" aria-label={filter.displayName+' options'}>
      {<input className="m365-filters-search" type="search" aria-label={'Find '+filter.displayName+' options'} placeholder={'Find '+filter.displayName.toLocaleLowerCase()} value={query} onChange={e=>{if(viewState)viewState.queries[filter.filterName]=e.currentTarget.value;setQuery(e.currentTarget.value);}}/>}
      <div className="m365-filters-values" role="group" aria-label={filter.displayName}>
        {visible.map(v=><label key={v.value} className={'m365-filters-option'+(v.disabled?' is-disabled':'')} title={v.name}>
          <input type="checkbox" data-filter-name={filter.filterName} data-refiner-value={v.value} checked={v.selected} disabled={Boolean(v.disabled)&&!v.selected} onChange={e=>{if(viewState)viewState.focus={filterName:filter.filterName,value:v.value};onChange(filter,v,e.currentTarget.checked);}}/>
          <span className="m365-filters-option-name">{v.name}</span>{filter.showCount && v.count!==undefined && <span className="m365-filters-count">{v.count}</span>}
        </label>)}
        {visible.length===0 && <p className="m365-filters-empty" role="status">{query?'No matching options.':'No values in these results.'}</p>}
      </div>
      <div onClick={event=>{if((event.target as HTMLElement).closest('button[data-action="apply"]'))close();}}>{actions}</div>
    </div>
  </section>;
};
