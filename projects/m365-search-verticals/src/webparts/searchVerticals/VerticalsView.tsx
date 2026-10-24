import * as React from 'react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Options, Vertical, safeUrl } from './model';
const banner='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 280"><defs><linearGradient id="b"><stop stop-color="#2d2d2d"/><stop offset=".65" stop-color="#cb202d"/><stop offset="1" stop-color="#f4f4f2"/></linearGradient></defs><path fill="url(#b)" d="M0 0h1400v280H0z"/><path fill="none" stroke="#f4f4f2" stroke-opacity=".16" stroke-width="40" d="M200-80c700 130 100 300 900 430"/></svg>');
interface Props {options:Options;rows:Vertical[];selected?:Vertical;onSelect:(key:string)=>void;baseUrl:string;editing?:boolean;}
export const VerticalsView:React.FC<Props>=({options,rows,selected,onSelect,baseUrl,editing})=>{
 const id=React.useRef('m365-verticals-'+Math.random().toString(36).slice(2));
 const keyboard=(event:React.KeyboardEvent<HTMLElement>)=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;const nodes=Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role=tab],a'));const index=nodes.indexOf(document.activeElement as HTMLElement);const next=event.key==='Home'?0:event.key==='End'?nodes.length-1:(index+(event.key==='ArrowLeft'?-1:1)+nodes.length)%nodes.length;if(nodes[next]){event.preventDefault();nodes[next].focus();}};
 const background=options.showBackground?(safeUrl(options.backgroundUrl,baseUrl)||banner):undefined;
 return <section className="m365-verticals" aria-label={options.title||'Search categories'}>
   {background&&<div className="m365-verticals-banner" style={{backgroundImage:'url("'+background.replace(/"/g,'%22')+'")'}} aria-hidden="true"/>}
   {(options.showTitle||options.showDescription)&&<header className="m365-verticals-header">{options.showTitle&&<h2>{options.title}</h2>}{options.showDescription&&<p>{options.description}</p>}</header>}
   {rows.length?<nav className="m365-verticals-nav" aria-label="Search verticals"><div role="tablist" aria-label="Search categories" onKeyDown={keyboard}>{rows.map(row=>row.isLink?<a key={row.key} href={safeUrl(row.linkUrl,baseUrl)} target={row.openBehavior==='NewTab'?'_blank':undefined} rel={row.openBehavior==='NewTab'?'noopener noreferrer':undefined} className="m365-verticals-tab">{row.iconName&&<Icon iconName={row.iconName} aria-hidden="true"/>}{row.tabName}{row.showLinkIcon&&<Icon iconName="OpenInNewWindow" aria-hidden="true"/>}</a>:<button key={row.key} type="button" role="tab" id={id.current+'-'+row.key} aria-selected={selected?.key===row.key} aria-controls={selected?.description?id.current+'-description':undefined} tabIndex={selected?.key===row.key?0:-1} className="m365-verticals-tab" onClick={()=>onSelect(row.key)}>{row.iconName&&<Icon iconName={row.iconName} aria-hidden="true"/>}{row.tabName}</button>)}</div></nav>:editing?<p className="m365-verticals-empty">Configure verticals to add your search categories.</p>:null}
   {selected?.description&&<div id={id.current+'-description'} className="m365-verticals-description" role="tabpanel" aria-labelledby={id.current+'-'+selected.key}><h3>{selected.tabName}</h3><p>{selected.description}</p></div>}
 </section>;
};
