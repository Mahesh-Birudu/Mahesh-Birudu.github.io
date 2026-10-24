import * as React from 'react';
import { LayoutOptions, MappingRow, WebPartChoice, validateOptions } from './model';

interface Props { options:LayoutOptions; choices:WebPartChoice[]; onSave:(value:LayoutOptions)=>void; onCancel:()=>void; onRefresh:()=>WebPartChoice[]; }
let serial=0;
export const ConfigurationEditor:React.FC<Props>=({options,choices,onSave,onCancel,onRefresh})=>{
  const[draft,setDraft]=React.useState<LayoutOptions>(()=>JSON.parse(JSON.stringify(options)));
  const[available,setAvailable]=React.useState(choices);
  const[error,setError]=React.useState('');
  const dialog=React.useRef<HTMLDivElement>(null);const previous=React.useRef<Element|null>(null);
  React.useEffect(()=>{previous.current=document.activeElement;dialog.current?.focus();return()=>{(previous.current as HTMLElement)?.focus?.();};},[]);
  const update=(patch:Partial<LayoutOptions>):void=>{setDraft(value=>({...value,...patch}));setError('');};
  const rowChange=(id:string,patch:Partial<MappingRow>):void=>update({rows:draft.rows.map(row=>row.id===id?{...row,...patch}:row)});
  const names=[...new Set(draft.rows.map(row=>row.containerName.trim()).filter(Boolean))];
  const save=():void=>{
    try{validateOptions(draft,new Set(available.map(p=>p.id)));onSave({...draft,rows:draft.rows.map(row=>({...row,containerName:row.containerName.trim(),width:row.width.trim()}))});}
    catch(e){setError((e as Error).message);}
  };
  return <div className="m365-layout-overlay"><div className="m365-layout-dialog" role="dialog" aria-modal="true" aria-label="Manage page columns" tabIndex={-1} ref={dialog}
    onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();onCancel();}if(event.key==='Tab'){
      const items=dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, textarea, [tabindex="0"]');
      if(!items?.length)return;const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }}}>
    <div className="m365-layout-dialog-heading"><div><h2>Manage page columns</h2><p>Select existing web parts. Give rows the same container name to stack them together.</p></div><button type="button" onClick={onCancel} aria-label="Close configuration">×</button></div>
    <p className="m365-layout-notice">This controller adapts SharePoint page markup. Microsoft updates and third-party web parts can affect compatibility. Original placement is restored in page edit mode.</p>
    <div className="m365-layout-editor-actions"><button type="button" onClick={()=>update({rows:[...draft.rows,{id:`row-${Date.now()}-${++serial}`,webPartId:'',containerName:'',width:'',columnOrder:names.length+1,stackOrder:1}]})}>+ Add web part</button><button type="button" onClick={()=>setAvailable(onRefresh())}>Refresh web-part list</button></div>
    <div className="m365-layout-table-scroll"><table><caption>Web-part assignments. Each unique container width is counted once.</caption><thead><tr><th>Web part</th><th>Container name</th><th>Width (%)</th><th>Column order</th><th>Stack order</th><th>Remove</th></tr></thead><tbody>
      {draft.rows.map((row,i)=><tr key={row.id}><td><select aria-label={`Web part, row ${i+1}`} value={row.webPartId} onChange={e=>rowChange(row.id,{webPartId:e.target.value})}><option value="">Select a web part</option>{row.webPartId&&!available.some(p=>p.id===row.webPartId)&&<option value={row.webPartId}>Missing: {row.webPartId}</option>}{available.map(p=><option key={p.id} value={p.id}>{p.title} · {p.id.slice(0,8)}</option>)}</select></td>
        <td><input aria-label={`Container name, row ${i+1}`} value={row.containerName} maxLength={100} onChange={e=>rowChange(row.id,{containerName:e.target.value})}/></td>
        <td><input aria-label={`Width, row ${i+1}`} value={row.width} inputMode="decimal" onChange={e=>rowChange(row.id,{width:e.target.value})}/></td>
        <td><input aria-label={`Column order, row ${i+1}`} type="number" min={1} step={1} value={row.columnOrder} onChange={e=>rowChange(row.id,{columnOrder:Number(e.target.value)})}/></td>
        <td><input aria-label={`Stack order, row ${i+1}`} type="number" min={1} step={1} value={row.stackOrder} onChange={e=>rowChange(row.id,{stackOrder:Number(e.target.value)})}/></td>
        <td><button type="button" aria-label={`Remove row ${i+1}`} onClick={()=>update({rows:draft.rows.filter(r=>r.id!==row.id)})}>Remove</button></td></tr>)}
      {!draft.rows.length&&<tr><td colSpan={6}>No assignments yet. Add the web parts you want to arrange.</td></tr>}
    </tbody></table></div>
    <fieldset><legend>Visibility control</legend><div className="m365-layout-fields"><label>Target container<select value={draft.toggleTarget} onChange={e=>update({toggleTarget:e.target.value})}><option value="">No show/hide button</option>{names.map(name=><option key={name}>{name}</option>)}</select></label>
      <label>Hide button text<input value={draft.hideText} onChange={e=>update({hideText:e.target.value})}/></label><label>Show button text<input value={draft.showText} onChange={e=>update({showText:e.target.value})}/></label>
      <label className="m365-layout-checkbox"><input type="checkbox" checked={draft.initiallyHidden} onChange={e=>update({initiallyHidden:e.target.checked})}/>Initially hide the target container</label></div></fieldset>
    <fieldset><legend>Responsive layout</legend><div className="m365-layout-fields"><label>Column gap (pixels)<input type="number" min={0} max={64} value={draft.gap} onChange={e=>update({gap:Number(e.target.value)})}/></label><label>Mobile breakpoint (pixels)<input type="number" min={320} max={1200} value={draft.breakpoint} onChange={e=>update({breakpoint:Number(e.target.value)})}/></label></div></fieldset>
    <details><summary>Advanced SharePoint compatibility</summary><p>These are discovery fallbacks, not custom styling hooks. Change them only when the page markup requires it.</p><div className="m365-layout-fields"><label>Section class<input value={draft.sectionClass} onChange={e=>update({sectionClass:e.target.value})}/></label><label>Web-part class<input value={draft.webPartClass} onChange={e=>update({webPartClass:e.target.value})}/></label></div></details>
    {error&&<p className="m365-layout-error" role="alert">{error}</p>}
    <div className="m365-layout-dialog-footer"><button type="button" onClick={onCancel}>Cancel</button><button className="m365-layout-primary" type="button" onClick={save}>Save configuration</button></div>
  </div></div>;
};
