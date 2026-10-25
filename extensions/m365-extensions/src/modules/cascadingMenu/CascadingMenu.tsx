import * as React from 'react';
import {Icon} from '@fluentui/react/lib/Icon';
import {MenuItem} from './model';
import {MenuEditor} from './MenuEditor';

export const CascadingMenu:React.FC<{items:MenuItem[];onSave?:(items:MenuItem[])=>Promise<void>}>=({items,onSave})=>{
 const [active,setActive]=React.useState('');
 const [editing,setEditing]=React.useState(false);
 const [expanded,setExpanded]=React.useState<string[]>([]);
 const root=React.useRef<HTMLElement>(null),edit=React.useRef<HTMLButtonElement>(null);
 const triggers=React.useRef<Record<string,HTMLButtonElement|null>>({});
 const close=(restore=false):void=>{if(restore)triggers.current[active]?.focus();setActive('');setExpanded([]);};
 React.useEffect(()=>{const outside=(e:PointerEvent):void=>{if(!root.current?.contains(e.target as Node)){setActive('');setExpanded([]);}};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[]);
 const top=items.filter(i=>!i.parentId),selected=top.find(i=>i.id===active);
 const children=(id:string):MenuItem[]=>items.filter(i=>i.parentId===id);
 const link=(item:MenuItem):React.ReactNode=>{const nested=children(item.id),open=expanded.includes(item.id);return <li key={item.id}>{nested.length?<><button type="button" className="ds-mega-expand" aria-expanded={open} onClick={()=>setExpanded(v=>open?v.filter(id=>id!==item.id):[...v,item.id])}><Icon iconName={item.icon}/><span>{item.label}</span><Icon iconName={open?'ChevronUp':'ChevronDown'}/></button>{open&&<ul className="ds-mega-nested">{nested.map(link)}</ul>}</>:<a href={item.url} onClick={()=>close()}><Icon iconName={item.icon}/><span>{item.label}</span></a>}</li>;};
 if(!items.length&&!onSave)return null;
 const groups=selected?children(selected.id):[];
 const firstDestination=selected?.url||items.find(i=>{let current:MenuItem|undefined=i;while(current?.parentId&&current.parentId!==active)current=items.find(p=>p.id===current!.parentId);return current?.parentId===active&&!!i.url;})?.url;
 return <nav ref={root} className="ds-intranet-menu ds-mega-nav" aria-label="Intranet navigation" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close(true);}}}>
  <ul className="ds-menu-main">{top.map((item,index)=>{const hasChildren=children(item.id).length>0,open=active===item.id;return <li key={item.id} className={open?'ds-menu-open':''}>{hasChildren?<button ref={node=>{triggers.current[item.id]=node;}} type="button" aria-expanded={open} aria-controls={'ds-mega-'+item.id} onClick={()=>{setActive(open?'':item.id);setExpanded([]);}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(item.id);window.setTimeout(()=>root.current?.querySelector<HTMLElement>('.ds-mega-panel a,.ds-mega-panel button')?.focus(),0);}if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=top[(index+(e.key==='ArrowRight'?1:top.length-1))%top.length];triggers.current[next.id]?.focus();}}}><Icon iconName={item.icon}/><span>{item.label}</span><Icon iconName="ChevronDown"/></button>:<a href={item.url}><Icon iconName={item.icon}/><span>{item.label}</span></a>}</li>;})}</ul>
  {onSave&&<button type="button" ref={edit} className="ds-menu-edit" onClick={()=>{close();setEditing(true);}}><Icon iconName="Edit"/>Edit</button>}
  {selected&&<section id={'ds-mega-'+selected.id} className="ds-mega-panel" aria-label={selected.label+' menu'}>
   <div className="ds-mega-panel-heading"><span>{selected.label}</span><button type="button" aria-label="Close navigation menu" onClick={()=>close(true)}><Icon iconName="Cancel"/></button></div>
   <div className="ds-mega-grid"><aside className="ds-mega-feature">{selected.imageUrl?<img src={selected.imageUrl} alt={selected.imageAlt||''}/>:<div className="ds-mega-art" aria-hidden="true"><Icon iconName={selected.icon}/><span>DEV STORIES</span></div>}<div><h2>{selected.label}</h2><p>{selected.description||'Discover the people, tools and resources that help you do your best work.'}</p>{firstDestination&&<a href={firstDestination} onClick={()=>close()}><span>Explore {selected.label}</span><Icon iconName="Forward"/></a>}</div></aside>
    <div className="ds-mega-columns">{groups.map(group=>{const rows=children(group.id);return <section key={group.id} className="ds-mega-column"><h3>{group.url?<a href={group.url} onClick={()=>close()}>{group.label}<Icon iconName="Forward"/></a>:group.label}</h3>{rows.length>0&&<ul>{rows.map(link)}</ul>}</section>;})}</div>
   </div>
  </section>}
  {editing&&onSave&&<MenuEditor items={items} onSave={onSave} onClose={()=>{setEditing(false);edit.current?.focus();}}/>}
 </nav>;
};
