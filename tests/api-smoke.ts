import assert from 'node:assert/strict';
const base=process.env.TEST_URL || 'http://localhost:3000';
const post=(url:string,body:unknown)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(60000)});
const health=await(await fetch(base+'/api/health')).json();
assert.equal(health.mode,'local-demo');assert.equal(typeof health.ai.groq,'boolean');
assert.equal((await post('/api/assistant',{message:''})).status,422);
assert.equal((await post('/api/promise-check',{})).status,400);
if(!health.ai.gemini&&!health.ai.groq) {
 assert.equal((await post('/api/assistant',{message:'Hello'})).status,503);
 assert.equal((await post('/api/promise-check',{rawText:'A test offer.'})).status,503);
}
const triage=await(await post('/api/smart-triage',{title:'Water leak',description:'Water near an electrical socket',location:'Test room',category:'hostel'})).json();
assert.ok(triage.department);
const item={id:'test-lost',type:'lost',title:'Black laptop bag',description:'Black backpack with a laptop compartment',category:'bags',location:'Library',status:'open'};
const match=await(await post('/api/campus-find/match',{newItem:item,existingItems:[{...item,id:'test-found',type:'found'}]})).json();
assert.equal(match.provider,'local');assert.equal(match.matches[0].matchedItemId,'test-found');assert.ok(match.matches[0].confidence>90);
const same=await(await post('/api/campus-find/match',{newItem:item,existingItems:[{...item,id:'same-type'}]})).json();assert.deepEqual(same.matches,[]);
console.log('PASS: health, validation, missing-key errors, triage, real MiniLM matching and opposite-type filtering.');
