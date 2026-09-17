import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const child=spawn(process.execPath,['dist/server.mjs'],{env:{...process.env,PORT:'3099',HOST:'127.0.0.1'},stdio:'pipe',windowsHide:true});
try {
 await new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>reject(new Error('Production server did not start')),20000);
   child.stdout.on('data',chunk=>{if(chunk.toString().includes('Yukti AI running')){clearTimeout(timer);resolve();}});
   child.on('error',reject);
   child.on('exit',code=>{if(code)reject(new Error('Production server exited'));});
 });
 assert.equal((await fetch('http://127.0.0.1:3099/api/health')).status,200);
 const page=await(await fetch('http://127.0.0.1:3099/')).text();
 assert.ok(page.includes('/assets/'));assert.ok(!page.includes('/src/main.tsx'));
 console.log('PASS: production server serves built assets and API.');
}finally{child.kill();}
