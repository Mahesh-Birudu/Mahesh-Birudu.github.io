export interface StockConfig { mode:'demo'|'custom'; companyName:string; symbol:string; currency:string; endpoint:string; sourceLabel:string; }
export const demoConfig:StockConfig={mode:'demo',companyName:'International Business Machines',symbol:'IBM',currency:'USD',endpoint:'',sourceLabel:'Alpha Vantage public daily demo'};
export function validateConfig(value:StockConfig):StockConfig {
 const config={...value,companyName:value.companyName.trim(),symbol:value.symbol.trim().toUpperCase(),currency:value.currency.trim().toUpperCase(),endpoint:value.endpoint.trim(),sourceLabel:value.sourceLabel.trim()};
 if(config.mode==='demo')return {...demoConfig};
 if(!config.companyName||!config.symbol||!/^[A-Z]{3}$/.test(config.currency)||!config.sourceLabel)throw new Error('Enter company name, stock symbol, three-letter currency and source label.');
 let url:URL;try{url=new URL(config.endpoint);}catch{throw new Error('Enter a valid HTTPS API or proxy URL.');}
 if(url.protocol!=='https:'||url.username||url.password||url.hash||/[?&](api[_-]?key|token|secret|authorization|access[_-]?key)=/i.test(url.href))throw new Error('Use an HTTPS endpoint without embedded credentials or API keys. Keep secrets in your server-side proxy.');
 return config;
}
