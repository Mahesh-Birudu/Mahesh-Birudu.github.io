import * as React from 'react';
import { FilterGroup, FilterValue,FilterViewState } from './types';
export const FilterSection:React.FC<{filter:FilterGroup;viewState?:FilterViewState;onChange:(f:FilterGroup,v:FilterValue,s:boolean)=>void}> = ({filter,onChange,viewState}) => {
  const [expanded,setExpanded] = React.useState(viewState?.expanded[filter.filterName]??filter.expandByDefault);
  const [query,setQuery] = React.useState(viewState?.queries[filter.filterName]||'');
  const optionsId = React.useRef('m365-options-'+Math.random().toString(36).slice(2));
  const visible = filter.values.filter(v=>v.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const selected = filter.values.filter(v=>v.selected).length;
  return <section className="m365-filters-section">
    <button className="m365-filters-heading" type="button" aria-expanded={expanded} aria-controls={optionsId.current} onClick={()=>{if(viewState)viewState.expanded[filter.filterName]=!expanded;setExpanded(!expanded);}}>
      <span>{filter.displayName}{selected>0 && <span className="m365-filters-badge">{selected}</span>}</span>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{transform:expanded?'rotate(180deg)':undefined}}><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    <div id={optionsId.current} hidden={!expanded} className="m365-filters-options">
      {filter.values.length>5 && <input className="m365-filters-search" type="search" aria-label={'Find '+filter.displayName+' options'} placeholder={'Find '+filter.displayName.toLocaleLowerCase()} value={query} onChange={e=>{if(viewState)viewState.queries[filter.filterName]=e.currentTarget.value;setQuery(e.currentTarget.value);}}/>}
      <div className="m365-filters-values" role="group" aria-label={filter.displayName}>
        {visible.map(v=><label key={v.value} className={'m365-filters-option'+(v.disabled?' is-disabled':'')}>
          <input type="checkbox" data-filter-name={filter.filterName} data-refiner-value={v.value} checked={v.selected} disabled={Boolean(v.disabled)&&!v.selected} onChange={e=>{if(viewState)viewState.focus={filterName:filter.filterName,value:v.value};onChange(filter,v,e.currentTarget.checked);}}/>
          <span className="m365-filters-option-name">{v.name}</span>{filter.showCount && v.count!==undefined && <span className="m365-filters-count">{v.count}</span>}
        </label>)}
        {visible.length===0 && <p className="m365-filters-empty" role="status">{query?'No matching options.':'No values in these results.'}</p>}
      </div>
    </div>
  </section>;
};
