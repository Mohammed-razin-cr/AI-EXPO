import path from 'node:path';
import { env, pipeline } from '@huggingface/transformers';
env.cacheDir = path.resolve('.cache/models');
let extractor: Promise<any> | null = null;
export const LOCAL_MODEL = 'Xenova/all-MiniLM-L6-v2';
export function loadMatcher() {
  if (!extractor) extractor = pipeline('feature-extraction', LOCAL_MODEL, {dtype:'q8',device:'cpu'}).catch(error => { extractor = null; throw error; });
  return extractor;
}
type Item = { id:string; type:string; title:string; description:string; category:string; location:string; status?:string };
export async function matchItems(item:Item, items:Item[]) {
  const candidates = items.filter(other => other.id !== item.id && other.type !== item.type && other.status !== 'returned').slice(0,100);
  if (!candidates.length) return [];
  const model = await loadMatcher();
  const describe = (entry:Item) => [entry.title,entry.description,entry.category,entry.location].join('. ').slice(0,1500);
  const embeddings = (await model([item,...candidates].map(describe),{pooling:'mean',normalize:true})).tolist() as number[][];
  return candidates.map((candidate,index) => ({matchedItemId:candidate.id,confidence:Math.round(Math.max(0,Math.min(1,embeddings[0].reduce((sum,n,j)=>sum+n*embeddings[index+1][j],0)))*100),reason:'Local semantic similarity of description, category and location. Confirm ownership before handover.'})).filter(match=>match.confidence>=45).sort((a,b)=>b.confidence-a.confidence).slice(0,5);
}
