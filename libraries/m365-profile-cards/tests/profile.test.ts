import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { normalizeIdentity, ProfileError, ProfileProvider, presenceDisplay, Profile } from '../src/models/Profile';
import { ProfileCard } from '../src/components/ProfileCard';
const tick=async()=>{await act(async()=>{await new Promise(resolve=>setTimeout(resolve,15));});};
function setup(provider:ProfileProvider,userId='person@example.test') {
  const dom=new JSDOM('<!doctype html><body><main></main></body>',{url:'https://example.test',pretendToBeVisual:true});
  for(const name of ['window','document','HTMLElement','Element','HTMLDialogElement','Event','MouseEvent']) Object.defineProperty(globalThis,name,{value:(dom.window as unknown as Record<string,unknown>)[name],configurable:true,writable:true});
  dom.window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  dom.window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new dom.window.Event('close'));};
  const host=dom.window.document.querySelector('main')!;
  const render=(identity:string)=>act(()=>{ReactDOM.render(React.createElement(ProfileCard,{userId:identity,provider,key:identity}),host);});
  render(userId);
  return {host,render,cleanup:()=>{act(()=>{ReactDOM.unmountComponentAtNode(host);});dom.window.close();}};
}
const person:Profile={id:'one',displayName:'Person',userPrincipalName:'person@example.test'};
test('identity accepts claims and guests and rejects paths',()=>{
  assert.equal(normalizeIdentity('i:0#.f|membership|person@example.test'),'person@example.test');
  assert.equal(normalizeIdentity('guest_example.com#EXT#@tenant.onmicrosoft.com'),'guest_example.com#EXT#@tenant.onmicrosoft.com');
  for(const value of ['', 'Person Name','../me','https://example.test','person@example.test?x=1'])assert.throws(()=>normalizeIdentity(value));
});
test('presence distinguishes unknown, offline and meeting',()=>{
  assert.equal(presenceDisplay({availability:'Offline'}).state,'offline');
  assert.equal(presenceDisplay({availability:'Busy',activity:'InAMeeting'}).label,'In a meeting');
  assert.equal(presenceDisplay().state,'unknown');
});
test('React escapes values and handles missing fields and slide-out focus',async()=>{
  const value='<img src=x onerror=alert(1)>';
  const view=setup({getProfile:async()=>({...person,displayName:value}),getPhoto:async()=>undefined});
  try{await tick();assert.equal(view.host.querySelector('h3')?.textContent,value);assert.equal(view.host.querySelector('h3 img'),null);assert.equal(view.host.querySelector('.m365-profile-title')?.textContent,'Job title not provided');
    const button=view.host.querySelector<HTMLButtonElement>('.m365-profile-open')!;button.focus();act(()=>button.click());assert.equal(view.host.querySelector('dialog')?.open,true);
    act(()=>view.host.querySelector<HTMLButtonElement>('[aria-label="Close profile"]')!.click());assert.equal(view.host.querySelector('dialog'),null);assert.equal(document.activeElement,button);
  }finally{view.cleanup();}
});
test('presence denial keeps card usable and never shows offline',async()=>{
  const view=setup({getProfile:async()=>person,getPhoto:async()=>undefined,getPresence:async()=>{throw new Error('403');}});
  try{await tick();assert.equal(view.host.querySelector('[data-presence]')?.getAttribute('data-presence'),'unknown');assert.ok(view.host.querySelector('.m365-profile-open'));}finally{view.cleanup();}
});
test('shared presence state renders in card and slide-out',async()=>{
  const view=setup({getProfile:async()=>person,getPhoto:async()=>undefined,getPresence:async()=>({availability:'Available'})});
  try{await tick();act(()=>view.host.querySelector<HTMLButtonElement>('.m365-profile-open')!.click());assert.equal(view.host.querySelectorAll('[data-presence="available"]').length,2);}finally{view.cleanup();}
});
test('retry recovers access denial',async()=>{
  let allowed=false;const view=setup({getProfile:async()=>{if(!allowed)throw new ProfileError(403);return person;},getPhoto:async()=>undefined});
  try{await tick();assert.match(view.host.textContent!,/permissions/);allowed=true;act(()=>view.host.querySelector<HTMLButtonElement>('.m365-profile-retry')!.click());await tick();assert.equal(view.host.querySelector('h3')?.textContent,'Person');assert.equal(view.host.querySelector('.m365-profile-retry'),null);}finally{view.cleanup();}
});
test('identity change ignores stale in-flight response',async()=>{
  let complete!:(value:Profile)=>void;const view=setup({getProfile:async identity=>identity==='person@example.test'?new Promise<Profile>(resolve=>{complete=resolve;}):{id:'two',displayName:'Second user'},getPhoto:async()=>undefined});
  try{view.render('second@example.test');await tick();await act(async()=>{complete(person);});assert.equal(view.host.querySelector('h3')?.textContent,'Second user');}finally{view.cleanup();}
});
test('unmount revokes photo object URL',async()=>{
  const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL;const revoked:string[]=[];
  URL.createObjectURL=()=> 'blob:test-photo';URL.revokeObjectURL=value=>{revoked.push(value);};
  const view=setup({getProfile:async()=>person,getPhoto:async()=>new Blob(['image'],{type:'image/png'})});
  try{await tick();assert.equal(view.host.querySelector('img')?.getAttribute('src'),'blob:test-photo');}finally{view.cleanup();URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;}
  assert.deepEqual(revoked,['blob:test-photo']);
});

test('slide-out uses the photo, branded header and icon detail rows; Escape restores focus',async()=>{
  const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL;
  URL.createObjectURL=()=> 'blob:drawer-photo';URL.revokeObjectURL=()=>{};
  const view=setup({getProfile:async()=>({...person,jobTitle:'Engineer',department:'Delivery',businessPhones:['+1 555 0100']}),getPhoto:async()=>new Blob(['photo'],{type:'image/png'})});
  try{await tick();const trigger=view.host.querySelector<HTMLButtonElement>('.m365-profile-open')!;trigger.focus();act(()=>trigger.click());
    const panel=view.host.querySelector<HTMLDialogElement>('.m365-profile-panel')!;
    assert.ok(panel.open);assert.equal(panel.querySelector('.m365-profile-panel-avatar img')?.getAttribute('src'),'blob:drawer-photo');
    assert.match(panel.querySelector<HTMLElement>('.m365-profile-panel-banner')!.style.backgroundImage,/data:image\/svg/);
    assert.equal(panel.querySelectorAll('.m365-profile-detail-row').length,9);assert.equal(panel.querySelector('a[href^="tel:"]')?.textContent,'+1 555 0100');
    act(()=>panel.dispatchEvent(new Event('cancel',{cancelable:true})));assert.equal(view.host.querySelector('dialog'),null);assert.equal(document.activeElement,trigger);
  }finally{view.cleanup();URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;}
});
