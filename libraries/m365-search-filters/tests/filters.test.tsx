import {test} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {act,Simulate} from 'react-dom/test-utils';
import {FilterPanel} from '../src/components/FilterPanel';
import {FilterGroup,FilterPanelProps} from '../src/components/types';
import {brandStyle} from '@mahesh/m365-search-brand';
const group:FilterGroup={filterName:'Department',displayName:'Department',expandByDefault:true,isMulti:true,showCount:true,canApply:true,values:[{name:'Engineering',value:'opaque:engineering',count:3,selected:false},{name:'HR',value:'opaque:hr',count:1,selected:true}]};
function setup(overrides:Partial<FilterPanelProps>={}){
  const dom=new JSDOM('<!doctype html><body><main></main></body>',{pretendToBeVisual:true});
  for(const name of ['window','document','HTMLElement','Element','HTMLDialogElement','Event','MouseEvent'])Object.defineProperty(globalThis,name,{value:(dom.window as unknown as Record<string,unknown>)[name],writable:true,configurable:true});
  dom.window.matchMedia=(()=>({matches:false,addEventListener:()=>{},removeEventListener:()=>{}})) as unknown as typeof dom.window.matchMedia;
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  const calls:unknown[][]=[];
  const props:FilterPanelProps={filters:[group],onChange:(...args)=>calls.push(['change',...args]),onApply:()=>calls.push(['apply']),onClear:()=>calls.push(['clear']),...overrides};
  const host=dom.window.document.querySelector('main')!;
  act(()=>{ReactDOM.render(<FilterPanel {...props}/>,host);});
  return {host,dom,calls,render:(filters:FilterGroup[])=>{act(()=>{ReactDOM.render(<FilterPanel {...props} filters={filters}/>,host);});},remount:()=>{act(()=>{ReactDOM.unmountComponentAtNode(host);});act(()=>{ReactDOM.render(<FilterPanel {...props}/>,host);});},cleanup:()=>{act(()=>{ReactDOM.unmountComponentAtNode(host);});dom.window.close();}};
}
test('checkbox preserves opaque refiner value, and selection waits for PnP props',()=>{const v=setup();try{act(()=>{const input=v.host.querySelector('input[type=checkbox]') as HTMLInputElement;input.checked=true;Simulate.change(input);});assert.equal(v.calls[0][0],'change');assert.equal((v.calls[0][2] as {value:string}).value,'opaque:engineering');assert.equal(v.calls[0][3],true);assert.equal(v.calls.some(c=>c[0]==='apply'),false);}finally{v.cleanup();}});
test('Apply and clear all call their separate PnP actions',()=>{const v=setup();try{act(()=>{(v.host.querySelector('.m365-filters-primary') as HTMLButtonElement).click();});act(()=>{(v.host.querySelector('.m365-filters-link') as HTMLButtonElement).click();});assert.deepEqual(v.calls,[['apply'],['clear']]);}finally{v.cleanup();}});
test('chips remove selected values without changing the search query',()=>{const v=setup();try{act(()=>{(v.host.querySelector('.m365-filters-chip') as HTMLButtonElement).click();});assert.equal(v.calls[0][3],false);assert.equal((v.calls[0][2] as {value:string}).value,'opaque:hr');}finally{v.cleanup();}});
test('accordion is keyboard-native and exposes expanded state',()=>{const v=setup();try{const button=v.host.querySelector('.m365-filters-heading') as HTMLButtonElement;act(()=>button.click());assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal((v.host.querySelector('.m365-filters-options') as HTMLElement).hidden,false);}finally{v.cleanup();}});
test('option search matches labels and provides no-match feedback',()=>{const v=setup({filters:[{...group,values:Array.from({length:7},(_,i)=>({name:'Team '+i,value:'t'+i,selected:false}))}]});try{const input=v.host.querySelector('.m365-filters-search') as HTMLInputElement;act(()=>{input.value='Team 4';Simulate.change(input);});assert.equal(v.host.querySelectorAll('.m365-filters-option').length,1);act(()=>{input.value='zzz';Simulate.change(input);});assert.match(v.host.textContent!,/No matching options/);}finally{v.cleanup();}});
test('unselected disabled values cannot be checked; selected ones remain removable',()=>{const v=setup({filters:[{...group,values:group.values.map(x=>({...x,disabled:true}))}]});try{const inputs=v.host.querySelectorAll<HTMLInputElement>('input[type=checkbox]');assert.equal(inputs[0].disabled,true);assert.equal(inputs[1].disabled,false);}finally{v.cleanup();}});
test('empty filters have an accessible message and no popup actions',()=>{const v=setup({filters:[]});try{assert.match(v.host.textContent!,/No filters available/);assert.equal(v.host.querySelector('.m365-filters-primary'),null);}finally{v.cleanup();}});
test('mobile dialog closes on Escape and restores trigger focus',()=>{const v=setup();try{const trigger=v.host.querySelector('.m365-filters-mobile-trigger') as HTMLButtonElement;trigger.focus();act(()=>trigger.click());assert.equal(v.host.querySelector('dialog')?.open,true);act(()=>Simulate.cancel(v.host.querySelector('dialog')!));assert.equal(v.host.querySelector('dialog'),null);assert.equal(v.dom.window.document.activeElement,trigger);}finally{v.cleanup();}});
test('React escapes untrusted filter labels',()=>{const v=setup({filters:[{...group,displayName:'<img src=x onerror=alert(1)>',values:[{name:'<script>bad</script>',value:'opaque',selected:true}]}]});try{assert.equal(v.host.querySelector('img,script'),null);assert.match(v.host.textContent!,/<script>bad/);}finally{v.cleanup();}});
test('shared product brand remains consistent across site themes',()=>{assert.equal(brandStyle({palette:{themePrimary:'#69797e'}})['--m365-primary'],'#cb202d');assert.equal(brandStyle({palette:{themePrimary:'red; background:url(x)'}})['--m365-primary'],'#cb202d');});


test('PnP element replacement preserves drawer, option search and checkbox focus',()=>{
  const state={mobileOpen:true,expanded:{Department:true},queries:{Department:'Team 4'},focus:{filterName:'Department',value:'t4'}};
  const v=setup({viewState:state,filters:[{...group,values:Array.from({length:7},(_,i)=>({name:'Team '+i,value:'t'+i,selected:false}))}]});
  try{
    assert.equal(v.host.querySelector('dialog')?.open,true);
    assert.equal((v.host.querySelector('.m365-filters-search') as HTMLInputElement).value,'Team 4');
    const input=v.host.querySelector('input[type=checkbox]') as HTMLInputElement;
    act(()=>{input.checked=true;Simulate.change(input);});
    v.remount();
    assert.equal(v.host.querySelector('dialog')?.open,true);
    assert.equal(v.host.querySelectorAll('.m365-filters-option').length,1);
    assert.equal((v.dom.window.document.activeElement as HTMLInputElement).dataset.refinerValue,'t4');
  }finally{v.cleanup();}
});


import {clearFilterFields} from '../src/components/clearFilters';
test('clear all dispatches a named PnP clear for every field using a stable target',()=>{const dom=new JSDOM('<!doctype html><body></body>');Object.defineProperty(globalThis,'CustomEvent',{value:dom.window.CustomEvent,writable:true,configurable:true});const target=dom.window.document.body;const names:string[]=[];target.addEventListener('clear',event=>names.push((event as CustomEvent).detail.filterName));clearFilterFields(target,'clear','webpart',[group,{...group,filterName:'Company'}]);assert.deepEqual(names,['Department','Company']);names.length=0;clearFilterFields(target,'clear','webpart',[group],'Department');assert.deepEqual(names,['Department']);dom.window.close();});

test('Clear is disabled for drafts and enabled only after Apply',()=>{const v=setup();try{
 const apply=()=>v.host.querySelector('.m365-filters-primary') as HTMLButtonElement;const clear=()=>v.host.querySelector('.m365-filters-link') as HTMLButtonElement;
 assert.equal(clear().disabled,true);assert.equal(apply().disabled,false);assert.ok(apply().classList.contains('is-pending'));
 act(()=>apply().click());assert.equal(apply().disabled,true);assert.equal(clear().disabled,false);
 act(()=>clear().click());assert.equal(clear().disabled,true);
}finally{v.cleanup();}});
test('popup starts closed and Escape restores trigger focus',()=>{const v=setup();try{
 const trigger=v.host.querySelector('.m365-filters-heading') as HTMLButtonElement;assert.equal(trigger.getAttribute('aria-expanded'),'false');
 act(()=>trigger.click());assert.equal(v.host.querySelector('.m365-filters-options')?.getAttribute('role'),'dialog');
 act(()=>trigger.dispatchEvent(new v.dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));
 assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(v.dom.window.document.activeElement,trigger);
}finally{v.cleanup();}});

test('all action buttons belong to a dropdown popup',()=>{const v=setup();try{const buttons=v.host.querySelectorAll('.m365-filters-footer button');assert.equal(buttons.length,2);for(const button of buttons)assert.ok(button.closest('.m365-filters-options[role=dialog]'));}finally{v.cleanup();}});

test('chip removal applies only after PnP returns the updated draft',()=>{const state={expanded:{},queries:{},appliedSelection:JSON.stringify([['Department','opaque:hr']])};const v=setup({viewState:state});try{
 act(()=>{(v.host.querySelector('.m365-filters-chip') as HTMLButtonElement).click();});
 assert.equal(v.calls.filter(c=>c[0]==='apply').length,0);
 v.render([{...group,values:group.values.map(x=>({...x,selected:false}))}]);
 assert.equal(v.calls.filter(c=>c[0]==='apply').length,1);assert.equal(state.appliedSelection,'[]');
}finally{v.cleanup();}});
test('option search exists even with two values and selection sorting does not move rows',()=>{const state={expanded:{},queries:{}};const v=setup({viewState:state});try{
 assert.ok(v.host.querySelector('.m365-filters-search'));
 const before=Array.from(v.host.querySelectorAll('.m365-filters-option-name'),e=>e.textContent);
 v.render([{...group,values:[group.values[1],{...group.values[0],selected:true}]}]);
 assert.deepEqual(Array.from(v.host.querySelectorAll('.m365-filters-option-name'),e=>e.textContent),before);
}finally{v.cleanup();}});
