export interface MenuItem {id:string;parentId:string;label:string;url:string;icon:string;imageUrl?:string;imageAlt?:string;description?:string;}
export function validateMenu(items:MenuItem[]):MenuItem[]{
 if(!Array.isArray(items)||items.length>150)throw new Error('Use at most 150 menu links.');
 const clean=items.map(i=>({id:String(i.id),parentId:String(i.parentId||''),label:String(i.label||'').trim(),url:String(i.url||'').trim(),icon:String(i.icon||'Link'),...(i.imageUrl?{imageUrl:String(i.imageUrl).trim(),imageAlt:String(i.imageAlt||'').trim()}:{}),...(i.description?{description:String(i.description).trim()}:{} )}));const ids=new Set(clean.map(i=>i.id));if(ids.size!==clean.length)throw new Error('Menu IDs must be unique.');
 for(const item of clean){if(item.imageUrl){let image:URL;try{image=new URL(item.imageUrl,'https://example.invalid');}catch{throw new Error('Invalid featured image URL.');}if(!['https:','http:'].includes(image.protocol)||/[\u0000-\u001f]/.test(item.imageUrl))throw new Error('Use a web URL for the featured image.');if(!item.imageAlt)throw new Error('Describe the featured image for accessibility.');}if(!item.id||!item.label)throw new Error('Give every menu item a label.');if(item.parentId&&!ids.has(item.parentId))throw new Error('Choose an existing parent for '+item.label+'.');const seen=new Set([item.id]);let parent=item.parentId,depth=1;while(parent){if(seen.has(parent))throw new Error('A menu item cannot be its own ancestor.');seen.add(parent);parent=clean.find(i=>i.id===parent)!.parentId;if(++depth>4)throw new Error('Use no more than four menu levels.');}if(item.url){let parsed:URL;try{parsed=new URL(item.url,'https://example.invalid');}catch{throw new Error('Invalid link for '+item.label+'.');}if(!['https:','http:'].includes(parsed.protocol)||/[\u0000-\u001f]/.test(item.url))throw new Error('Use a web link for '+item.label+'.');}else if(!clean.some(i=>i.parentId===item.id))throw new Error('Enter a link for '+item.label+' or add a child item.');if(!/^[A-Za-z][A-Za-z0-9]{0,50}$/.test(item.icon))throw new Error('Choose a Fluent icon name for '+item.label+'.');}
 return clean;
}
export function removeBranch(items:MenuItem[],id:string):MenuItem[]{const remove=new Set([id]);let previous=0;while(previous!==remove.size){previous=remove.size;for(const item of items)if(remove.has(item.parentId))remove.add(item.id);}return items.filter(i=>!remove.has(i.id));}
export function sampleMenu():MenuItem[]{return [
 {id:'about',parentId:'',label:'My Dev Stories',url:'',icon:'People'},
 {id:'about-story',parentId:'about',label:'Our story',url:'https://www.microsoft.com/about',icon:'Info'},
 {id:'about-teams',parentId:'about',label:'Teams',url:'',icon:'Org'},
 {id:'team-tech',parentId:'about-teams',label:'Technology',url:'',icon:'Code'},
 {id:'team-dev',parentId:'team-tech',label:'Developer community',url:'https://developer.microsoft.com',icon:'DeveloperTools'},
 {id:'news',parentId:'',label:'Tools & essentials',url:'',icon:'Calendar'},
 {id:'news-events',parentId:'tools-essentials',label:'Events',url:'https://events.microsoft.com',icon:'Calendar'},
 {id:'news-blog',parentId:'tools-essentials',label:'News and stories',url:'https://blogs.microsoft.com',icon:'News'},
 {id:'find',parentId:'',label:'Business development',url:'',icon:'Search'},
 {id:'find-directory',parentId:'find',label:'People directory',url:'/sites/metrics/SitePages/ModernPnp.aspx',icon:'Contact'},
 {id:'find-docs',parentId:'find',label:'Documents',url:'/sites/metrics/Shared%20Documents/Forms/AllItems.aspx',icon:'Document'},
 {id:'resources',parentId:'',label:'Functions & operations',url:'',icon:'Library'},
 {id:'resources-learning',parentId:'resources',label:'Learning',url:'https://learn.microsoft.com',icon:'Education'},
 {id:'resources-support',parentId:'resources',label:'Support',url:'https://support.microsoft.com',icon:'Help'},
 {id:'about-explore',parentId:'about',label:'Explore',url:'',icon:'CompassNW'},
 {id:'about-people',parentId:'about-explore',label:'Find people',url:'/sites/metrics/SitePages/ModernPnp.aspx',icon:'People'},
 {id:'about-glossary',parentId:'about-explore',label:'Glossary',url:'https://learn.microsoft.com',icon:'Dictionary'},
 {id:'tools-local',parentId:'news',label:'Key local tools',url:'',icon:'Toolbox'},
 {id:'tools-desk',parentId:'tools-local',label:'Desk booking',url:'https://www.microsoft.com/microsoft-places',icon:'Work'},
 {id:'tools-learning',parentId:'tools-local',label:'Learning library',url:'https://learn.microsoft.com',icon:'Education'},
 {id:'tools-explore',parentId:'news',label:'Explore',url:'',icon:'CompassNW'},
 {id:'find-people',parentId:'tools-explore',label:'Find people',url:'/sites/metrics/SitePages/ModernPnp.aspx',icon:'People'},
 {id:'tools-howto',parentId:'tools-explore',label:'How to',url:'https://support.microsoft.com',icon:'Help'},
 {id:'tools-essentials',parentId:'news',label:'Dev Stories essentials',url:'',icon:'Library'},
 {id:'tools-about',parentId:'tools-essentials',label:'About Dev Stories',url:'https://www.microsoft.com/about',icon:'Info'},
 {id:'tools-search',parentId:'tools-essentials',label:'Search page',url:'/sites/metrics/SitePages/ModernPnp.aspx',icon:'Search'}
];}