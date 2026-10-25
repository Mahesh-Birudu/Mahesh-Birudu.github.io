import test from 'node:test';
import assert from 'node:assert/strict';
import {placeTour} from '../projects/dev-stories-intranet/demo-src/tourPosition.mjs';
const size={width:390,height:240},viewport={width:1280,height:720};
test('places the card beside a left-hand filter target',()=>{const p=placeTour({left:30,right:260,top:250,bottom:450},viewport,size);assert.equal(p.placement,'right');assert.ok(p.left>260);});
test('places a stock step to the left of its top-right ticker',()=>{const p=placeTour({left:1030,right:1230,top:70,bottom:110},viewport,size);assert.equal(p.placement,'left');assert.ok(p.left+390<1030);});
test('places a wide header step below the selected header',()=>{const p=placeTour({left:0,right:1280,top:50,bottom:120},viewport,size);assert.equal(p.placement,'bottom');assert.ok(p.top>120);});
test('keeps tour cards within narrow and short viewports',()=>{for(const v of [{width:390,height:700},{width:320,height:480}]){const p=placeTour({left:10,right:v.width-10,top:350,bottom:450},v,size);assert.ok(p.left>=16&&p.left+p.width<=v.width-16);assert.ok(p.top>=16&&p.top+240<=v.height-16);}});
test('an offscreen target cannot place the card outside the viewport',()=>{const p=placeTour({left:20,right:900,top:-700,bottom:-100},viewport,size);assert.ok(p.top>=16);assert.ok(p.top+240<=704);});
