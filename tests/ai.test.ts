import test from 'node:test';
import assert from 'node:assert/strict';
import { generate, configured } from '../server/ai';
import { promiseResult, triageResult } from '../server/schemas';
test('placeholder keys are not configured',()=>{assert.equal(configured('MY_GEMINI_API_KEY'),false);assert.equal(configured(''),false);});
test('missing credentials returns actionable error',async()=>{
 delete process.env.GEMINI_API_KEY;delete process.env.GROQ_API_KEY;
 await assert.rejects(()=>generate({system:'Test',message:'Test'}),/Configure GEMINI_API_KEY/);
});
test('Groq transport, JSON and secret-safe failure',async()=>{
 const originalFetch=globalThis.fetch;
 process.env.AI_PROVIDER='groq';process.env.GROQ_API_KEY='test-not-a-real-key';
 try {
  globalThis.fetch=async(input,options)=>{
   assert.equal(String(input),'https://api.groq.com/openai/v1/chat/completions');
   const body=JSON.parse(String(options?.body));assert.equal(body.response_format.type,'json_object');
   assert.equal(body.messages[0].role,'system');
   return new Response(JSON.stringify({choices:[{message:{content:'{"ok":true}'}}]}),{status:200});
  };
  const result=await generate({system:'Return JSON',message:'Test',json:true});
  assert.deepEqual(result.value,{ok:true});assert.equal(result.provider,'groq');
  globalThis.fetch=async()=>new Response('test-not-a-real-key secret upstream details',{status:401});
  await assert.rejects(()=>generate({system:'Test',message:'Test'}),error=>error instanceof Error&&!error.message.includes('test-not-a-real-key')&&error.message.includes('AI request failed'));
 }finally{globalThis.fetch=originalFetch;delete process.env.GROQ_API_KEY;delete process.env.AI_PROVIDER;}
});
test('malformed structured outputs are rejected',()=>{
 assert.equal(promiseResult.safeParse({overallRiskScore:999}).success,false);
 assert.equal(triageResult.safeParse({urgency:'critical',department:'Safety',estimatedHours:2,severityReason:'hazard',suggestedFix:'Call security'}).success,true);
});
test('Gemini transport keeps instructions separate and returns text',async()=>{
 const originalFetch=globalThis.fetch;
 process.env.AI_PROVIDER='gemini';process.env.GEMINI_API_KEY='test-not-a-real-key';
 try {
  globalThis.fetch=async(input,options)=>{
   const request=input instanceof Request?input:null;
   const url=request?.url||String(input);
   assert.ok(url.includes('generativelanguage.googleapis.com'));
   const body=JSON.parse(request?await request.text():String(options?.body));
   assert.ok(body.systemInstruction);assert.ok(body.contents);
   return new Response(JSON.stringify({candidates:[{content:{role:'model',parts:[{text:'Test response'}]},finishReason:'STOP'}]}),{status:200,headers:{'Content-Type':'application/json'}});
  };
  const result=await generate({system:'Test instructions',message:'Hello'});
  assert.equal(result.provider,'gemini');assert.equal(result.value,'Test response');
 }finally{globalThis.fetch=originalFetch;delete process.env.GEMINI_API_KEY;delete process.env.AI_PROVIDER;}
});
