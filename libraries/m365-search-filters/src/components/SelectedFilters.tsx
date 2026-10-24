import * as React from 'react';
import { FilterGroup,FilterCallbacks } from './types';
export const SelectedFilters:React.FC<{filters:FilterGroup[];onChange:FilterCallbacks['onChange']}> = ({filters,onChange}) => <div className="m365-filters-chips" aria-label="Selected filter values">
  {filters.flatMap(f=>f.values.filter(v=>v.selected).map(v=><button type="button" key={f.filterName+':'+v.value} className="m365-filters-chip" aria-label={'Remove '+f.displayName+': '+v.name} onClick={()=>onChange(f,v,false)}>{v.name}<span aria-hidden="true">×</span></button>))}
</div>;
