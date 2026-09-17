import test from 'node:test';
import assert from 'node:assert/strict';
import { createDemoDocument } from '../src/lib/demoDocument';
import { SAMPLE_DOCUMENTS } from '../src/data/mockData';
test('ready document generates a real PDF with demo marking',async()=>{
 const blob=await createDemoDocument(SAMPLE_DOCUMENTS.find(d=>d.status==='ready')!);
 const bytes=await blob.text();
 assert.ok(bytes.startsWith('%PDF-'));assert.ok(bytes.includes('SAMPLE ONLY'));assert.ok(blob.size>1000);
});
test('unapproved documents cannot be exported',async()=>{
 await assert.rejects(()=>createDemoDocument({...SAMPLE_DOCUMENTS[0],status:'submitted'}),/not ready/);
});
