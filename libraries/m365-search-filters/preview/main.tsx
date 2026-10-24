import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FilterPanel } from '../src/components/FilterPanel';
import { FilterGroup,FilterValue } from '../src/components/types';
import { ProfileCard } from '../../m365-profile-cards/src/components/ProfileCard';
import { Profile,ProfileProvider } from '../../m365-profile-cards/src/models/Profile';
const theme={palette:{themePrimary:'#0078d4',themeLighterAlt:'#eef6fc'}};
const people:Profile[]=[
  {id:'alex@example.test',displayName:'Alex Morgan',mail:'alex@example.test',department:'Digital Workplace',jobTitle:'SharePoint Developer',officeLocation:'Hyderabad',companyName:'Contoso Studio'},
  {id:'jenny@example.test',displayName:'Jenny Wilson',mail:'jenny@example.test',department:'Leadership',jobTitle:'Director',officeLocation:'Seattle',companyName:'Contoso Studio'},
  {id:'priya@example.test',displayName:'Priya Patel',mail:'priya@example.test',department:'Digital Workplace',jobTitle:'SharePoint Developer',officeLocation:'Hyderabad',companyName:'Contoso Studio'},
  {id:'sam@example.test',displayName:'Sam Lee',mail:'sam@example.test',department:'Operations',jobTitle:'Analyst',officeLocation:'London',companyName:'Fabrikam'},
  {id:'david@example.test',displayName:'David Chen',mail:'david@example.test',department:'Operations',jobTitle:'Analyst',officeLocation:'Seattle',companyName:'Fabrikam'},
  {id:'ava@example.test',displayName:'Ava Brown',mail:'ava@example.test',department:'Leadership',jobTitle:'Director',officeLocation:'London',companyName:'Contoso Studio'}
];
const provider:ProfileProvider={getProfile:async id=>people.find(p=>p.id===id)!,getPhoto:async()=>undefined,getPresence:async id=>({availability:id.startsWith('alex')?'Busy':'Available'})};
const fields=[['department','Department'],['officeLocation','Office'],['companyName','Company'],['jobTitle','Job title']] as const;
function initial():FilterGroup[]{return fields.map(([field,label])=>({filterName:field,displayName:label,expandByDefault:true,isMulti:true,showCount:true,values:[...new Set(people.map(p=>p[field]!))].map(value=>({name:value,value,selected:false,count:people.filter(p=>p[field]===value).length}))}));}
const Demo:React.FC=()=>{
  const [draft,setDraft]=React.useState(initial);
  const [applied,setApplied]=React.useState(initial);
  const [query,setQuery]=React.useState('');
  const selectedMatches=(p:Profile,groups:FilterGroup[]):boolean=>groups.every(f=>{const s=f.values.filter(v=>v.selected);return !s.length||s.some(v=>p[f.filterName as keyof Profile]===v.value);});
  const searched=people.filter(p=>(p.displayName+' '+p.mail).toLowerCase().includes(query.toLowerCase()));
  const filtered=searched.filter(p=>selectedMatches(p,applied));
  const filters=draft.map(f=>({...f,canApply:JSON.stringify(f.values.map(v=>v.selected))!==JSON.stringify(applied.find(a=>a.filterName===f.filterName)!.values.map(v=>v.selected)),values:f.values.map(v=>({...v,count:searched.filter(p=>selectedMatches(p,applied.filter(a=>a.filterName!==f.filterName))&&p[f.filterName as keyof Profile]===v.value).length}))}));
  const change=(filter:FilterGroup,value:FilterValue,selected:boolean):void=>setDraft(gs=>gs.map(f=>f.filterName===filter.filterName?{...f,values:f.values.map(v=>v.value===value.value?{...v,selected}:v)}:f));
  return <><header className="preview-header"><span className="preview-logo">M365 <b>Directory</b></span><input type="search" aria-label="Search demo people" placeholder="Search people by name or email" value={query} onChange={e=>setQuery(e.currentTarget.value)}/><span className="preview-label">LOCAL REVIEW</span></header>
    <main className="preview-main"><div className="preview-intro"><p>PEOPLE & CONNECTIONS</p><h1>A little more connected.</h1><span>Find your people. Refine by team, office or role.</span></div><div className="preview-layout">
    <FilterPanel filters={filters} themeVariant={theme} onChange={change} onApply={()=>setApplied(draft)} onClear={()=>{setDraft(initial());setApplied(initial());}}/>
    <section aria-label="People results"><div className="preview-results-header"><h2>People</h2><span role="status">{filtered.length} results</span></div><div className="preview-cards">{filtered.map(p=><m365-profile-details key={p.id}><ProfileCard userId={p.id} provider={provider} themeVariant={theme}/></m365-profile-details>)}</div>{!filtered.length&&<p>No matching people. Clear the filters or try a different name.</p>}</section>
    </div><footer className="preview-note">Synthetic profiles · Production React components · Preview simulates PnP refinement semantics. SharePoint connections require tenant validation.</footer></main></>;
};
declare global {namespace JSX {interface IntrinsicElements {'m365-profile-details':React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>,HTMLElement>;}}}
ReactDOM.render(<Demo/>,document.getElementById('app'));
