import * as React from 'react';
import * as ReactDom from 'react-dom';
import {ConfigurationEditor} from '../src/webparts/columnSplitter/ConfigurationEditor';
import {PageLayoutView} from '../src/webparts/columnSplitter/PageLayoutView';
import {discoverWebParts} from '../src/webparts/columnSplitter/PageAdapter';
import {emptyOptions,LayoutOptions} from '../src/webparts/columnSplitter/model';
import '../src/webparts/columnSplitter/pageLayout.css';
const host=document.getElementById('root') as HTMLElement;
const App=():React.ReactElement=>{
  const[options,setOptions]=React.useState<LayoutOptions>(emptyOptions);
  const[editing,setEditing]=React.useState(true);const[open,setOpen]=React.useState(false);
  const discover=():ReturnType<typeof discoverWebParts>=>discoverWebParts(document,host,options.webPartClass);
  return <div className="m365-page-controller"><div className="m365-layout-toolbar"><button onClick={()=>{setEditing(!editing);setOpen(false);}}>{editing?'Preview saved layout':'Edit configuration'}</button>{editing&&<button onClick={()=>setOpen(true)}>Manage columns</button>}</div>
    <p>{editing?'The cards below are independent mock page web parts. Choose any names, groups and widths.':'Read-mode simulation: hide/show redistributes the remaining width.'}</p>
    {!editing&&options.rows.length>0&&<PageLayoutView options={options} controller={host}/>}
    {editing&&open&&<ConfigurationEditor options={options} choices={discover()} onRefresh={discover} onCancel={()=>setOpen(false)} onSave={value=>{setOptions(value);setOpen(false);}}/>}
  </div>;
};
ReactDom.render(<App/>,host);
