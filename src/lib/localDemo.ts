import { useEffect, useRef, useState } from 'react';
export function useLocalDemoState<T>(key: string, initial: T) {
  const storageKey = 'campus360.v1.' + key;
  const [remoteEnabled,setRemoteEnabled] = useState(false);
  const hydrated = useRef(false);
  const [value,setValue] = useState<T>(() => {
    try { const stored = localStorage.getItem(storageKey); if (!stored) return initial; const parsed = JSON.parse(stored); return Array.isArray(initial) ? (Array.isArray(parsed) ? parsed : initial) : typeof parsed === typeof initial ? parsed : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(storageKey,JSON.stringify(value)); }
    catch { window.dispatchEvent(new CustomEvent('campus-storage-error')); }
  },[storageKey,value]);
  useEffect(() => {
    let active=true;
    fetch('/api/state/'+encodeURIComponent(key))
      .then(async response => {
        if(response.status===404) { if(active)setRemoteEnabled(true); return null; }
        if(!response.ok) throw new Error('Database unavailable');
        return response.json();
      })
      .then(result => {
        if(!active)return;
        if(result && Object.prototype.hasOwnProperty.call(result,'data')) {
          setValue(result.data as T);
          setRemoteEnabled(true);
        }
      })
      .catch(() => { if(active)window.dispatchEvent(new CustomEvent('campus-database-error')); })
      .finally(() => { hydrated.current=true; });
    return()=>{active=false;};
  },[key]);
  useEffect(() => {
    if(!hydrated.current||!remoteEnabled)return;
    const timer=window.setTimeout(()=>{
      fetch('/api/state/'+encodeURIComponent(key),{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({data:value}),
      }).then(response=>{if(!response.ok)throw new Error();}).catch(()=>window.dispatchEvent(new CustomEvent('campus-database-error')));
    },400);
    return()=>window.clearTimeout(timer);
  },[key,remoteEnabled,value]);
  return [value,setValue] as const;
}
export async function requestAI(endpoint:string,body:unknown) {
  let response:Response;
  try { response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(60000)}); }
  catch { throw new Error('Cannot reach the AI service or the request timed out. Check the server and retry.'); }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The request failed. Please retry.');
  return data;
}
