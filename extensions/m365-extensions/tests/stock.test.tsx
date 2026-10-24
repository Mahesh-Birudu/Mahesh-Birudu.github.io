import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateConfig,demoConfig} from '../src/modules/stock/config';
import {parseCustomStock} from '../src/modules/stock/stockService';
const config={...demoConfig,mode:'custom' as const,companyName:'Example Company',symbol:'MSFT',endpoint:'https://example.com/stock',sourceLabel:'Daily close'};
test('company API configuration rejects embedded secrets and insecure endpoints',()=>{assert.equal(validateConfig(config).symbol,'MSFT');for(const endpoint of ['http://example.com/stock','https://example.com/stock?apikey=private','https://user:password@example.com/stock'])assert.throws(()=>validateConfig({...config,endpoint}));});
test('custom API values are validated against the company symbol and history is ordered',()=>{const data={quote:{symbol:'MSFT',price:123,change:1,percent:.82,date:'2026-10-20'},history:[{date:'2026-10-20',close:123},{date:'2026-10-19',close:122}]};assert.equal(parseCustomStock(data,config).history[0].date,'2026-10-19');assert.throws(()=>parseCustomStock({...data,quote:{...data.quote,symbol:'IBM'}},config));assert.throws(()=>parseCustomStock({...data,history:[...data.history,data.history[0]]},config));});
