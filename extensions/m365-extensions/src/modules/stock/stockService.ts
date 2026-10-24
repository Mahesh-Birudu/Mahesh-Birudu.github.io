import { parseQuote,parseHistory,Quote,PricePoint } from '../../extensions/companyHeader/model';
import {StockConfig,demoConfig,validateConfig} from './config';
const cache=new Map<string,{expires:number;value:Promise<Record<string,unknown>>}>();
async function request(fn:string):Promise<Record<string,unknown>>{const saved=cache.get(fn);if(saved&&saved.expires>Date.now())return saved.value;const operation=(async()=>{const controller=new AbortController();const timer=window.setTimeout(()=>controller.abort(),10000);try{const response=await fetch('https://www.alphavantage.co/query?function='+fn+'&symbol=IBM&apikey=demo',{credentials:'omit',signal:controller.signal});if(!response.ok)throw new Error('Stock data is temporarily unavailable.');return await response.json() as Record<string,unknown>;}finally{window.clearTimeout(timer);}})();cache.set(fn,{expires:Date.now()+15*60*1000,value:operation});try{return await operation;}catch(error){cache.delete(fn);throw error;}}
export function parseCustomStock(data:{quote:Quote;history:PricePoint[]},config:StockConfig):{quote:Quote;history:PricePoint[]}{
 const quote=data?.quote;
 if(!quote||quote.symbol!==config.symbol||!/^\d{4}-\d{2}-\d{2}$/.test(quote.date)||![quote.price,quote.change,quote.percent].every(n=>typeof n==='number'&&Number.isFinite(n))||quote.price<=0)throw new Error('The API quote does not match the configured symbol or response format.');
 if(!Array.isArray(data.history)||!data.history.length||data.history.some(p=>!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||typeof p.close!=='number'||!Number.isFinite(p.close)||p.close<=0))throw new Error('The API must return valid dated daily closing prices.');
 const history=[...data.history].sort((a,b)=>a.date.localeCompare(b.date));if(new Set(history.map(p=>p.date)).size!==history.length)throw new Error('The API history contains duplicate dates.');return {quote,history};
}
export async function loadStock(input:StockConfig=demoConfig):Promise<{quote:Quote;history:PricePoint[]}>{
 const config=validateConfig(input);
 if(config.mode==='custom'){const controller=new AbortController();const timer=window.setTimeout(()=>controller.abort(),10000);try{const response=await fetch(config.endpoint,{credentials:'omit',signal:controller.signal,headers:{Accept:'application/json'}});if(!response.ok)throw new Error('The configured stock API is unavailable.');return parseCustomStock(await response.json(),config);}finally{window.clearTimeout(timer);}}
 const [quote,history]=await Promise.all([request('GLOBAL_QUOTE'),request('TIME_SERIES_DAILY')]);const points=parseHistory(history);if(!points.length)throw new Error('Price history is temporarily unavailable.');return {quote:parseQuote(quote),history:points};}
