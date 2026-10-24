import {NavigationConfig,defaultNavigation,validateNavigation} from './config';
/** Unsupported Microsoft DOM adapter. All host selectors are owner-configurable. */
export class SuiteNavigationAdapter {
 private hiddenSections=new Set<HTMLElement>();private branding?:HTMLElement;private siteHeader?:HTMLElement;private observer?:MutationObserver;private host?:HTMLElement;private nav?:HTMLElement;private style?:HTMLStyleElement;
 public start(onMount:(host:HTMLElement)=>void,onUnmount:(host:HTMLElement)=>void,input:NavigationConfig=defaultNavigation):void {
  const config=validateNavigation(input);
  const unique=(selector:string):HTMLElement|undefined=>{const matches=document.querySelectorAll<HTMLElement>(selector);return matches.length===1?matches[0]:undefined;};
  const reconcile=():void=>{
   const nav=unique(config.nav),right=unique(config.right),account=unique(config.account);
   const brand=unique(config.brand);if(brand&&!brand.querySelector('.ds-intranet-label')){this.branding?.remove();this.branding=document.createElement('span');this.branding.className='ds-intranet-label';this.branding.textContent='INTRANET';brand.append(this.branding);}
   for(const selector of [config.appRail,config.hubNavigation]){const target=unique(selector);if(target&&!target.contains(nav||null)&&!nav?.contains(target)&&!target.querySelector('.ds-intranet-menu')){target.setAttribute('data-ds-extra-section-hidden','true');this.hiddenSections.add(target);}}
   const header=unique(config.siteHeader);if(header&&!header.contains(nav||null)&&!nav?.contains(header)){this.siteHeader?.removeAttribute('data-ds-site-header-hidden');this.siteHeader=header;header.setAttribute('data-ds-site-header-hidden','true');}
   if(this.host?.isConnected&&nav===this.nav&&right?.contains(this.host)&&account)return;
   if(this.host){onUnmount(this.host);this.host.remove();this.nav?.removeAttribute('data-ds-suite-active');this.host=undefined;}
   if(!nav||!right||!account||!nav.contains(right)||!right.contains(account))return;
   this.nav=nav;this.host=document.createElement('div');this.host.className='ds-suite-extension';right.prepend(this.host);onMount(this.host);nav.setAttribute('data-ds-suite-active','true');
  };
  this.style=document.createElement('style');const scope=config.nav+'[data-ds-suite-active]';this.style.textContent=`#spPageChromeAppDiv .sp-pageLayout-horizontalNav{margin:0!important;border-radius:0!important;box-shadow:none!important;border:0!important}[data-ds-extra-section-hidden],[data-ds-site-header-hidden]{display:none!important}.ds-intranet-label{display:inline-flex;align-items:center;margin-left:16px;color:#2d2d2d;font:600 12px/1.4 'Segoe UI',Arial;letter-spacing:1px;white-space:nowrap} ${scope}{display:flex!important}${scope} ${config.center}{flex:1 1 auto!important;min-width:0!important;width:auto!important}${scope} ${config.right}{width:auto!important;min-width:0!important;display:flex!important;align-items:center!important;background:transparent!important}${scope} ${config.account},${scope} ${config.product}{display:none!important}`;
  document.head.append(this.style);reconcile();this.observer=new MutationObserver(reconcile);this.observer.observe(document.body,{childList:true,subtree:true});
 }
 public dispose(onUnmount:(host:HTMLElement)=>void):void{this.observer?.disconnect();for(const target of this.hiddenSections)target.removeAttribute('data-ds-extra-section-hidden');this.hiddenSections.clear();this.branding?.remove();this.siteHeader?.removeAttribute('data-ds-site-header-hidden');if(this.host){onUnmount(this.host);this.host.remove();}this.nav?.removeAttribute('data-ds-suite-active');this.style?.remove();this.host=undefined;}
}
