import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {emptyOptions,MappingRow,planLayout,validateOptions} from '../src/webparts/columnSplitter/model.ts';
const row=(id:string,name:string,width:string,order:number,stack=1):MappingRow=>({id,webPartId:id,containerName:name,width,columnOrder:order,stackOrder:stack});
test('names and percentages are configurable; duplicate group counts once',()=>{
 const plan=planLayout([row('a','My sidebar','27.5%',3,2),row('b','My sidebar','27.5',3,1),row('c','Workspace','72.5%',9)]);
 assert.equal(plan.length,2);assert.deepEqual(plan[0].rows.map(r=>r.webPartId),['b','a']);assert.equal(plan[0].width,27.5);
});
test('supports arbitrary one, two or three containers and trimmed names',()=>{
 assert.equal(planLayout([row('a',' Whole page ','100',1)])[0].name,'Whole page');
 assert.equal(planLayout([row('a','A','13',1),row('b','B','61',2),row('c','C','26',3)]).length,3);
});
test('no preset assignments or target',()=>{const v=emptyOptions();assert.deepEqual(v.rows,[]);assert.equal(v.toggleTarget,'');assert.throws(()=>planLayout(v.rows));});
test('rejects repeated web part IDs',()=>assert.throws(()=>planLayout([row('a','One','50',1),row('a','Two','50',2)]),/already assigned/));
test('rejects inconsistent shared group widths and column order',()=>{
 assert.throws(()=>planLayout([row('a','G','20',1),row('b','G','30',1,2)]),/same width/);
 assert.throws(()=>planLayout([row('a','G','100',1),row('b','G','100',2,2)]),/column order/);
});
test('rejects ambiguous stack and column orders',()=>{
 assert.throws(()=>planLayout([row('a','G','100',1),row('b','G','100',1)]),/stack order/);
 assert.throws(()=>planLayout([row('a','A','50',1),row('b','B','50',1)]),/different column order/);
});
test('requires 100 percent across unique groups',()=>assert.throws(()=>planLayout([row('a','A','20',1),row('b','B','70',2)]),/90%/));
test('rejects invalid widths, empty names, missing IDs and invalid orders',()=>{
 for(const width of ['','0','-5','101','Infinity','20abc','0x64'])assert.throws(()=>planLayout([row('a','A',width,1)]));
 assert.throws(()=>planLayout([row('a',' ','100',1)]));assert.throws(()=>planLayout([row('','A','100',1)]));assert.throws(()=>planLayout([row('a','A','100',1.5)]));
});
test('validates target, labels, advanced classes and availability',()=>{
 const base={...emptyOptions(),rows:[row('a','User chosen','100',1)]};
 assert.throws(()=>validateOptions({...base,toggleTarget:'Missing'}));
 assert.throws(()=>validateOptions({...base,toggleTarget:'User chosen',hideText:''}));
 assert.throws(()=>validateOptions({...base,webPartClass:'body > div'}));
 assert.throws(()=>validateOptions(base,new Set(['b'])));
 assert.equal(validateOptions({...base,toggleTarget:'User chosen',showText:'Expand tools',hideText:'Collapse tools'})[0].name,'User chosen');
});
