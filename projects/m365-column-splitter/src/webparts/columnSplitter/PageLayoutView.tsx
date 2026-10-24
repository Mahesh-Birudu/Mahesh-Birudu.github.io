import * as React from 'react';
import { PageAdapter } from './PageAdapter';
import { LayoutOptions, validateOptions } from './model';
export const PageLayoutView:React.FC<{options:LayoutOptions;controller:HTMLElement}>=({options,controller})=>{
  const mount=React.useRef<HTMLDivElement>(null);const adapter=React.useRef<PageAdapter>();
  const[status,setStatus]=React.useState('');const[active,setActive]=React.useState(true);
  const[hidden,setHidden]=React.useState(options.initiallyHidden);
  const signature=JSON.stringify(options);
  React.useLayoutEffect(()=>{
    if(!active||!mount.current)return;
    const instance=new PageAdapter(controller.ownerDocument,mount.current,controller);adapter.current=instance;
    let cancelled=false;let timer:ReturnType<typeof setTimeout>|undefined;let attempts=0;
    const start=():void=>{
      try{
        const plan=validateOptions(options);
        instance.apply(options,plan,message=>{if(!cancelled){setStatus(message);setActive(false);}});
        setHidden(options.initiallyHidden);setStatus('');
      }catch(error){
        const message=(error as Error).message;
        if(message.includes('missing')&&attempts++<20){setStatus('Waiting for the selected web parts to load…');timer=setTimeout(start,500);}
        else setStatus(message);
      }
    };
    start();return()=>{cancelled=true;if(timer)clearTimeout(timer);instance.restore();adapter.current=undefined;};
  },[signature,active,controller]);
  return <div className="m365-page-layout">
    <div className="m365-layout-toolbar">
      {active&&options.toggleTarget&&<button className="m365-layout-primary" type="button" aria-expanded={!hidden} onClick={()=>{adapter.current?.setHidden(options.toggleTarget,!hidden);setHidden(!hidden);}}>{hidden?options.showText:options.hideText}</button>}
      <button type="button" onClick={()=>{setActive(value=>!value);setStatus('');}}>{active?'Restore original layout':'Apply configured layout'}</button>
    </div>
    {status&&<p role="status" className="m365-layout-notice">{status}</p>}
    <div ref={mount}/>
  </div>;
};
