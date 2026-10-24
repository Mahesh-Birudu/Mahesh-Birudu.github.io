import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {discoverWebParts,PageAdapter} from '../src/webparts/columnSplitter/PageAdapter.ts';
import {emptyOptions,LayoutOptions,validateOptions} from '../src/webparts/columnSplitter/model.ts';
const ids=['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333'];
function fixture(){
 const dom=new JSDOM(`<main><div id="controller"><div id="mount"></div></div>${ids.map((id,i)=>`<section class="CanvasSection" id="origin${i}"><div data-automation-id="CanvasControl" class="ControlZone" id="${id}"><div data-sp-feature-instance-id="${id}" data-sp-feature-tag="test web part (Part ${i})"><button>Action ${i}</button></div></div></section>`).join('')}</main>`,{url:'https://example.sharepoint.com/sites/test/SitePages/Test.aspx'});
 const doc=dom.window.document;const controller=doc.getElementById('controller')!;const mount=doc.getElementById('mount')!;
 const options:LayoutOptions={...emptyOptions(),toggleTarget:'Tools',rows:ids.map((id,i)=>({id,webPartId:id,containerName:i<2?'Tools':'Content',width:i<2?'25':'75',columnOrder:i<2?1:2,stackOrder:i<2?i+1:1}))};
 return {dom,doc,controller,mount,options,adapter:new PageAdapter(doc,mount,controller)};
}
test('discovers stable instance IDs, excludes controller and unrelated page elements',()=>{
 const f=fixture();f.controller.innerHTML+='<div class="ControlZone" id="44444444-4444-4444-8444-444444444444"><div data-sp-feature-instance-id="44444444-4444-4444-8444-444444444444"></div></div>';
 assert.deepEqual(discoverWebParts(f.doc,f.controller,'ControlZone').map(p=>p.id),ids);f.dom.window.close();
});
test('groups actual nodes in stack order, retains click handlers, restores exact placement',()=>{
 const f=fixture();const nodes=ids.map(id=>f.doc.getElementById(id)!);let clicks=0;nodes[0].querySelector('button')!.addEventListener('click',()=>clicks++);
 f.adapter.apply(f.options,validateOptions(f.options),()=>{});
 assert.deepEqual([...f.mount.querySelectorAll('[data-container-name="Tools"] [data-automation-id="CanvasControl"]')],nodes.slice(0,2));
 (nodes[0].querySelector('button') as HTMLButtonElement).click();assert.equal(clicks,1);assert.equal(f.doc.getElementById('origin0')!.hidden,true);
 f.adapter.restore();ids.forEach((id,i)=>assert.equal(f.doc.getElementById(id)!.parentElement?.id,`origin${i}`));
 assert.equal(f.doc.getElementById('origin0')!.hidden,false);assert.equal(f.mount.children.length,0);assert.equal(nodes[0].className,'ControlZone');f.dom.window.close();
});
test('hide/show retains nodes and reallocates remaining width',()=>{
 const f=fixture();f.adapter.apply(f.options,validateOptions(f.options),()=>{});f.adapter.setHidden('Tools',true);
 assert.equal((f.mount.querySelector('[data-container-name="Tools"]') as HTMLElement).hidden,true);
 assert.equal((f.mount.firstElementChild as HTMLElement).style.gridTemplateColumns,'minmax(0, 75fr)');assert.equal(f.doc.getElementById(ids[0])!.isConnected,true);
 f.adapter.setHidden('Tools',false);assert.equal((f.mount.firstElementChild as HTMLElement).style.gridTemplateColumns,'minmax(0, 25fr) minmax(0, 75fr)');f.adapter.restore();f.dom.window.close();
});
test('does not hide an origin section containing an unselected part',()=>{
 const f=fixture();f.doc.getElementById('origin0')!.append(f.doc.getElementById(ids[2])!);
 const options={...f.options,rows:[{...f.options.rows[0],width:'100'}],toggleTarget:''};f.adapter.apply(options,validateOptions(options),()=>{});
 assert.equal(f.doc.getElementById('origin0')!.hidden,false);f.adapter.restore();f.dom.window.close();
});
test('missing and duplicate-owner targets fail before moving additional nodes',()=>{
 const f=fixture();f.adapter.apply(f.options,validateOptions(f.options),()=>{});
 const other=f.doc.createElement('div');f.doc.body.append(other);const second=new PageAdapter(f.doc,other,other);
 assert.throws(()=>second.apply(f.options,validateOptions(f.options),()=>{}),/missing/);
 assert.equal(f.mount.querySelectorAll('[data-automation-id="CanvasControl"]').length,3);f.adapter.restore();f.dom.window.close();
});
test('normalizes native Flexible positioning and restores inline styles',()=>{
 const f=fixture();const host=f.doc.getElementById(ids[0])!;host.firstElementChild!.setAttribute('data-flex-control-id',ids[0]);host.firstElementChild!.setAttribute('style','position: absolute; width: 378px; left: 100px;');
 const before=host.firstElementChild!.getAttribute('style');f.adapter.apply(f.options,validateOptions(f.options),()=>{});assert.equal((host.firstElementChild as HTMLElement).style.width,'100%');f.adapter.restore();assert.equal(host.firstElementChild!.getAttribute('style'),before);f.dom.window.close();
});
test('page edit transition restores content automatically',async()=>{
 const f=fixture();let message='';f.adapter.apply(f.options,validateOptions(f.options),m=>message=m);f.dom.window.history.pushState({},'','?Mode=Edit');f.doc.body.append(f.doc.createElement('span'));
 await new Promise(resolve=>setTimeout(resolve,0));assert.match(message,/editing/);assert.equal(f.doc.getElementById(ids[0])!.parentElement?.id,'origin0');f.adapter.restore();f.dom.window.close();
});
test('restoration is idempotent and preserves preexisting section styles',()=>{
 const f=fixture();f.doc.getElementById('origin0')!.setAttribute('style','display: flex; color: red;');const before=f.doc.getElementById('origin0')!.getAttribute('style');
 f.adapter.apply({...f.options,initiallyHidden:true},validateOptions(f.options),()=>{});assert.equal((f.mount.querySelector('[data-container-name="Tools"]') as HTMLElement).hidden,true);
 f.adapter.restore();f.adapter.restore();assert.equal(f.doc.getElementById('origin0')!.getAttribute('style'),before);f.dom.window.close();
});
test('rejects selected nested web parts without changing the page',()=>{
 const f=fixture();f.doc.getElementById(ids[0])!.append(f.doc.getElementById(ids[1])!);
 assert.throws(()=>f.adapter.apply(f.options,validateOptions(f.options),()=>{}),/Nested/);
 assert.equal(f.doc.getElementById(ids[1])!.parentElement?.id,ids[0]);assert.equal(f.mount.children.length,0);f.dom.window.close();
});
test('restores selected content when native markup removes a managed host',async()=>{
 const f=fixture();let message='';f.adapter.apply(f.options,validateOptions(f.options),m=>message=m);const host=f.doc.getElementById(ids[0])!;host.remove();
 await new Promise(resolve=>setTimeout(resolve,0));assert.match(message,/changed the page structure/);assert.equal(host.parentElement?.id,'origin0');assert.equal(host.isConnected,true);f.dom.window.close();
});
test('mobile media changes stack columns and unregister on restoration',()=>{
 const f=fixture();let change:((e:{matches:boolean})=>void)|undefined;let removed=false;
 Object.defineProperty(f.dom.window,'matchMedia',{value:()=>({matches:true,addEventListener:(_type:string,fn:typeof change)=>{change=fn;},removeEventListener:()=>{removed=true;}})});
 f.adapter.apply(f.options,validateOptions(f.options),()=>{});assert.equal((f.mount.firstElementChild as HTMLElement).style.gridTemplateColumns,'minmax(0, 1fr)');
 change!({matches:false});assert.equal((f.mount.firstElementChild as HTMLElement).style.gridTemplateColumns,'minmax(0, 25fr) minmax(0, 75fr)');f.adapter.restore();assert.equal(removed,true);f.dom.window.close();
});
