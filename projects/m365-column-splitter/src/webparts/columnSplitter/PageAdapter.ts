import { classNameIsValid, ContainerPlan, LayoutOptions, WebPartChoice } from './model';

const owners=new WeakMap<HTMLElement,object>();
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export interface DiscoveredPart extends WebPartChoice { element:HTMLElement; }
/** Compatibility boundary: SharePoint's page markup is not a supported layout API. */
export function discoverWebParts(doc:Document,controller:HTMLElement,webPartClass:string):DiscoveredPart[] {
  if(!classNameIsValid(webPartClass))return [];
  const result:DiscoveredPart[]=[];const ids=new Set<string>();
  const candidates=doc.querySelectorAll<HTMLElement>(`[data-automation-id="CanvasControl"],.${webPartClass}`);
  candidates.forEach(element=>{
    if(element===controller||element.contains(controller)||controller.contains(element))return;
    const feature=element.querySelector<HTMLElement>('[data-sp-feature-instance-id]');
    const id=feature?.getAttribute('data-sp-feature-instance-id')||element.id;
    if(!id||!uuid.test(id)||ids.has(id)||owners.has(element))return;
    // Exclude arbitrary page elements that merely share a class name or GUID.
    if(!feature&&!element.querySelector('[data-sp-web-part-id]'))return;
    const tag=feature?.getAttribute('data-sp-feature-tag')||'';
    const title=tag.match(/web part \((.+)\)/i)?.[1]||element.querySelector('[data-automation-id="canvas-hover-label"]')?.textContent?.trim()||`Web part ${id}`;
    ids.add(id);result.push({id,title,element});
  });
  return result;
}
interface SavedHost { element:HTMLElement; marker:Comment; parent:Node; next:Node|null; classAdded:boolean; }
interface SavedStyle { element:HTMLElement; value:string|null; }
export class PageAdapter {
  private saved:SavedHost[]=[];
  private styles:SavedStyle[]=[];
  private hiddenSections:Array<{element:HTMLElement;hidden:boolean;style:string|null}>=[];
  private containers=new Map<string,HTMLElement>();
  private grid:HTMLElement|undefined;
  private owner={};
  private observer:MutationObserver|undefined;
  private media:MediaQueryList|undefined;
  private plan:ContainerPlan[]=[];
  private hidden=new Set<string>();
  private breakpoint=768;
  private narrow=false;
  private failed=false;
  private onInvalidated:((message:string)=>void)|undefined;
  public constructor(private doc:Document,private mount:HTMLElement,private controller:HTMLElement){}
  public apply(options:LayoutOptions,plan:ContainerPlan[],onInvalidated:(message:string)=>void):void {
    this.restore();this.failed=false;this.plan=plan;this.breakpoint=options.breakpoint;this.onInvalidated=onInvalidated;
    const parts=discoverWebParts(this.doc,this.controller,options.webPartClass);
    const byId=new Map(parts.map(p=>[p.id,p.element]));
    const all=plan.flatMap(g=>g.rows.map(r=>byId.get(r.webPartId)));
    if(all.some(el=>!el))throw new Error('A configured web part is missing or is controlled by another splitter. Original layout retained.');
    if(!this.mount.isConnected||!this.controller.isConnected)throw new Error('The controller is no longer on the page.');
    const selected=new Set(all as HTMLElement[]);
    if([...selected].some(a=>[...selected].some(b=>a!==b&&a.contains(b))))throw new Error('Nested web parts cannot be assigned together. Original layout retained.');
    // Record only fully selected origin columns/sections; never hide an unrelated web part.
    const sections=new Set<HTMLElement>();
    selected.forEach(el=>{
      const section=el.closest<HTMLElement>(`.${options.sectionClass}`)||el.closest<HTMLElement>('[data-automation-id="CanvasZoneEdit"],[data-automation-id="CanvasZone"]');
      if(section&&!section.contains(this.controller)){
        const contained=parts.filter(p=>section.contains(p.element));
        if(contained.length&&contained.every(p=>selected.has(p.element)))sections.add(section);
      }
    });
    try{
      this.grid=this.doc.createElement('div');this.grid.className='m365-page-columns';this.grid.style.gap=`${options.gap}px`;
      this.mount.append(this.grid);
      plan.forEach(group=>{
        const container=this.doc.createElement('section');container.className='m365-page-column';container.setAttribute('aria-label',group.name);container.dataset.containerName=group.name;
        container.style.gap=`${options.gap}px`;this.grid?.append(container);this.containers.set(group.name,container);
        group.rows.forEach(row=>{
          const element=byId.get(row.webPartId) as HTMLElement;
          if(owners.has(element)||!element.parentNode)throw new Error('A web part cannot be acquired. Original layout restored.');
          const parent=element.parentNode;const next=element.nextSibling;
          const marker=this.doc.createComment(`m365-layout:${row.webPartId}`);parent.insertBefore(marker,element);
          const classAdded=!element.classList.contains('m365-page-managed-host');
          this.saved.push({element,marker,parent,next,classAdded});owners.set(element,this.owner);
          element.classList.add('m365-page-managed-host');
          // Native Flexible controls use absolute positioning; normalize only this selected control.
          element.querySelectorAll<HTMLElement>('[data-flex-control-id]').forEach(child=>{
            if(child.getAttribute('data-flex-control-id')!==row.webPartId)return;
            this.styles.push({element:child,value:child.getAttribute('style')});
            child.style.position='relative';child.style.left='auto';child.style.top='auto';child.style.width='100%';child.style.maxWidth='100%';child.style.transform='none';
          });
          container.append(element);
        });
      });
      sections.forEach(element=>{this.hiddenSections.push({element,hidden:element.hidden,style:element.getAttribute('style')});element.hidden=true;element.style.setProperty('display','none','important');});
      if(options.initiallyHidden&&options.toggleTarget)this.hidden.add(options.toggleTarget);
      const win=this.doc.defaultView;
      if(win&&typeof win.matchMedia==='function'){
        this.media=win.matchMedia(`(max-width: ${this.breakpoint}px)`);this.narrow=this.media.matches;
        this.media.addEventListener('change',this.onMediaChange);
      }
      this.updateVisibility();
      const Observer=win?.MutationObserver;
      if(Observer){this.observer=new Observer(()=>this.checkIntegrity());this.observer.observe(this.doc.documentElement,{childList:true,subtree:true});}
      win?.addEventListener('pagehide',this.onPageHide);
    }catch(error){this.restore();throw error;}
  }
  private onMediaChange=(event:MediaQueryListEvent):void=>{this.narrow=event.matches;this.updateVisibility();};
  private onPageHide=():void=>{this.restore();};
  private checkIntegrity():void {
    if(this.failed)return;
    const editing=new URL(this.doc.location?.href||'https://local.invalid').searchParams.get('Mode')?.toLowerCase()==='edit';
    if(editing||!this.controller.isConnected||this.saved.some(h=>!h.element.isConnected||!h.marker.parentNode?.isConnected)){
      this.failed=true;this.restore();this.onInvalidated?.(editing?'Original layout restored for page editing.':'SharePoint changed the page structure. Original layout restored where possible; reload the page before applying again.');
    }
  }
  public setHidden(name:string,value:boolean):void {
    if(!this.containers.has(name))return;
    if(value)this.hidden.add(name);else this.hidden.delete(name);
    this.updateVisibility();
  }
  private updateVisibility():void {
    const visible=this.plan.filter(group=>!this.hidden.has(group.name));
    this.containers.forEach((element,name)=>{element.hidden=this.hidden.has(name);});
    if(this.grid)this.grid.style.gridTemplateColumns=this.narrow?'minmax(0, 1fr)':visible.map(group=>`minmax(0, ${group.width}fr)`).join(' ');
    // Fractions automatically distribute the full available width among remaining columns.
  }
  public restore():void {
    this.observer?.disconnect();this.observer=undefined;
    this.media?.removeEventListener('change',this.onMediaChange);this.media=undefined;
    this.doc.defaultView?.removeEventListener('pagehide',this.onPageHide);
    this.saved.slice().reverse().forEach(({element,marker,parent,next,classAdded})=>{
      if(marker.parentNode?.isConnected)marker.parentNode.insertBefore(element,marker);
      else if(parent.isConnected)parent.insertBefore(element,next?.parentNode===parent?next:null);
      else if(this.controller.isConnected&&this.mount.contains(element)){
        // Keep content reachable if SharePoint removed its original parent during a rerender.
        this.controller.parentNode?.insertBefore(element,this.controller.nextSibling);
      }
      marker.remove();if(classAdded)element.classList.remove('m365-page-managed-host');owners.delete(element);
    });
    this.styles.forEach(({element,value})=>{if(value===null)element.removeAttribute('style');else element.setAttribute('style',value);});
    this.hiddenSections.forEach(({element,hidden,style})=>{element.hidden=hidden;if(style===null)element.removeAttribute('style');else element.setAttribute('style',style);});
    this.grid?.remove();this.grid=undefined;this.saved=[];this.styles=[];this.hiddenSections=[];this.containers.clear();this.hidden.clear();
  }
}
