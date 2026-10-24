import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { brandStyle } from '@mahesh/m365-search-brand';
import { defaults,Options,Vertical,sourceData } from '../src/webparts/searchVerticals/model';
import { VerticalsView } from '../src/webparts/searchVerticals/VerticalsView';
import { VerticalsEditor } from '../src/webparts/searchVerticals/VerticalsEditor';
initializeIcons();
const samples=['Pages & documents','Tools','People','SME','News','Events','Business development','Offerings','How to'];
const rows:Vertical[]=samples.map((tabName,i)=>({key:'sample-'+i,tabName,tabValue:tabName.toLowerCase(),isLink:false,linkUrl:'',openBehavior:'Self',showLinkIcon:false,description:tabName==='People'?'Search for a colleague using a name or keyword, then refine your results with the filters.':'Explore '+tabName.toLowerCase()+' using the connected search results.'}));
function Preview(){const [options,setOptions]=React.useState<Options>({...defaults(),verticals:rows});const [key,setKey]=React.useState('sample-2');const [edit,setEdit]=React.useState(false);const selected=options.verticals.find(r=>r.key===key)||options.verticals[0];React.useEffect(()=>{document.getElementById('connection')!.textContent='Connected Search Results receive:\n'+JSON.stringify(sourceData(options,selected),null,2);},[options,selected]);return <div style={brandStyle() as React.CSSProperties}><VerticalsView options={options} rows={options.verticals} selected={selected} onSelect={setKey} baseUrl={window.location.href}/><button className="m365-verticals-configure" onClick={()=>setEdit(true)}>Configure verticals</button>{edit&&<VerticalsEditor rows={options.verticals} baseUrl={window.location.href} onClose={()=>setEdit(false)} onSave={verticals=>{setOptions({...options,verticals});setEdit(false);}}/>}</div>;}
ReactDOM.render(<Preview/>,document.getElementById('app'));
