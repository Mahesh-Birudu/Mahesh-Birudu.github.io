import { SearchTheme } from '@mahesh/m365-search-brand';
/** Structural subset of the public PnP IDataFilterInternal contract. Values stay opaque. */
export interface FilterValue {name:string;value:string;selected:boolean;disabled?:boolean;count?:number;operator?:number;}
export interface FilterGroup {filterName:string;displayName:string;values:FilterValue[];isMulti:boolean;showCount:boolean;expandByDefault:boolean;canApply?:boolean;canClear?:boolean;operator?:string;}
export interface FilterCallbacks {onChange:(filter:FilterGroup,value:FilterValue,selected:boolean)=>void;onApply:()=>void;onClear:(filterName?:string)=>void;}
export interface FilterViewState {mobileOpen?:boolean;appliedSelection?:string;pendingChipApply?:string;optionOrder?:Record<string,string[]>;expanded:Record<string,boolean>;queries:Record<string,string>;focus?:{filterName:string;value:string};}
export interface FilterPanelProps extends FilterCallbacks {filters:FilterGroup[];themeVariant?:SearchTheme;viewState?:FilterViewState;}
