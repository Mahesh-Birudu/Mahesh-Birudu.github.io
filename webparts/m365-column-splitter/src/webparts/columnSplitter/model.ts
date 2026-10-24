export interface MappingRow {
  id: string;
  webPartId: string;
  containerName: string;
  width: string;
  columnOrder: number;
  stackOrder: number;
}
export interface ContainerPlan { name:string; width:number; order:number; rows:MappingRow[]; }
export interface LayoutOptions {
  rows:MappingRow[];
  toggleTarget:string;
  hideText:string;
  showText:string;
  initiallyHidden:boolean;
  gap:number;
  breakpoint:number;
  sectionClass:string;
  webPartClass:string;
}
export interface WebPartChoice { id:string; title:string; }
export const emptyOptions = ():LayoutOptions => ({rows:[],toggleTarget:'',hideText:'Hide container',showText:'Show container',initiallyHidden:false,gap:16,breakpoint:768,sectionClass:'CanvasSection',webPartClass:'ControlZone'});
export function classNameIsValid(value:string):boolean { return /^[a-zA-Z_][\w-]*$/.test(value); }
export function planLayout(rows:readonly MappingRow[], availableIds?:ReadonlySet<string>):ContainerPlan[] {
  if(!rows.length) throw new Error('Add at least one web part to the configuration.');
  const seen=new Set<string>(); const groups=new Map<string,ContainerPlan>();
  rows.forEach((row,index)=>{
    const prefix=`Row ${index+1}: `;
    const name=row.containerName.trim();
    if(!row.webPartId)throw new Error(prefix+'select a web part.');
    if(seen.has(row.webPartId))throw new Error(prefix+'this web part is already assigned.');
    if(availableIds && !availableIds.has(row.webPartId))throw new Error(prefix+'the selected web part is not available on this page.');
    seen.add(row.webPartId);
    if(!name)throw new Error(prefix+'enter a container name.');
    const text=row.width.trim().replace(/%$/,'').trim();
    const width=/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)?Number(text):NaN;
    if(!Number.isFinite(width)||width<=0||width>100)throw new Error(prefix+'width must be greater than 0 and at most 100%.');
    if(!Number.isInteger(row.columnOrder)||row.columnOrder<1||!Number.isInteger(row.stackOrder)||row.stackOrder<1)throw new Error(prefix+'orders must be positive whole numbers.');
    const existing=groups.get(name);
    if(existing){
      if(Math.abs(existing.width-width)>0.000001||existing.order!==row.columnOrder)throw new Error(prefix+'rows sharing a container must use the same width and column order.');
      if(existing.rows.some(r=>r.stackOrder===row.stackOrder))throw new Error(prefix+'stack order must be unique within this container.');
      existing.rows.push({...row,containerName:name});
    }else groups.set(name,{name,width,order:row.columnOrder,rows:[{...row,containerName:name}]});
  });
  const result=[...groups.values()].sort((a,b)=>a.order-b.order);
  if(new Set(result.map(g=>g.order)).size!==result.length)throw new Error('Use a different column order for each unique container.');
  const total=result.reduce((sum,g)=>sum+g.width,0);
  if(Math.abs(total-100)>0.000001)throw new Error(`Unique container widths total ${Number(total.toFixed(6))}%. They must total 100%.`);
  result.forEach(group=>group.rows.sort((a,b)=>a.stackOrder-b.stackOrder));
  return result;
}
export function validateOptions(options:LayoutOptions,availableIds?:ReadonlySet<string>):ContainerPlan[] {
  const plan=planLayout(options.rows,availableIds);
  if(options.toggleTarget && !plan.some(g=>g.name===options.toggleTarget))throw new Error('Choose a toggle target from the configured containers.');
  if(options.toggleTarget && (!options.hideText.trim()||!options.showText.trim()))throw new Error('Enter both show and hide button labels.');
  if(!Number.isInteger(options.gap)||options.gap<0||options.gap>64)throw new Error('Column gap must be a whole number from 0 to 64 pixels.');
  if(!Number.isInteger(options.breakpoint)||options.breakpoint<320||options.breakpoint>1200)throw new Error('Mobile breakpoint must be from 320 to 1200 pixels.');
  if(!classNameIsValid(options.sectionClass)||!classNameIsValid(options.webPartClass))throw new Error('Advanced class identifiers must be single CSS class names.');
  return plan;
}
