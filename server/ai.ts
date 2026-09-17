import { GoogleGenAI } from '@google/genai';
export class AIError extends Error { constructor(message: string, public status = 503) { super(message); } }
export const configured = (key?: string) => !!key?.trim() && !/^(MY_|YOUR_|replace|placeholder)/i.test(key.trim());
export function aiStatus() { return { gemini: configured(process.env.GEMINI_API_KEY), groq: configured(process.env.GROQ_API_KEY), preferred: process.env.AI_PROVIDER || 'auto', geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash', groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' }; }
type Options = { system: string; message: string; json?: boolean; image?: {data:string; mimeType:string} };
export async function generate(options: Options) {
  const status = aiStatus();
  const preferred = status.preferred;
  let providers = preferred === 'groq' ? ['groq','gemini'] : ['gemini','groq'];
  if (preferred !== 'auto') providers = providers.filter(p => p === preferred);
  providers = providers.filter(p => p === 'gemini' ? status.gemini : status.groq && !options.image);
  if (!providers.length) throw new AIError(options.image ? 'Image analysis requires GEMINI_API_KEY in the local .env file. Restart the server after configuring it.' : 'Configure GEMINI_API_KEY or GROQ_API_KEY in the local .env file, then restart the server.');
  for (const provider of providers) {
    try {
      let text: string | undefined;
      const model = provider === 'gemini' ? status.geminiModel : status.groqModel;
      if (provider === 'gemini') {
        const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
        const parts: any[] = [{text:options.message}];
        if (options.image) parts.push({inlineData:options.image});
        const result = await ai.models.generateContent({model, contents:[{role:'user',parts}], config:{systemInstruction:options.system, ...(options.json ? {responseMimeType:'application/json'} : {}), httpOptions:{timeout:25000}, maxOutputTokens:6000}});
        text = result.text;
      } else {
        const result = await fetch('https://api.groq.com/openai/v1/chat/completions', { method:'POST', signal:AbortSignal.timeout(25000), headers:{'Content-Type':'application/json',Authorization:'Bearer '+process.env.GROQ_API_KEY}, body:JSON.stringify({model, messages:[{role:'system',content:options.system},{role:'user',content:options.message}], temperature:0.2,max_completion_tokens:6000,...(options.json ? {response_format:{type:'json_object'}} : {})}) });
        if (!result.ok) throw new Error('Upstream request failed');
        const resultBody = await result.json();
        text = resultBody.choices?.[0]?.message?.content;
      }
      if (!text?.trim()) throw new Error('Empty response');
      return { value:options.json ? JSON.parse(text.replace(/^\s*```(?:json)?/i,'').replace(/```\s*$/,'').trim()) : text, provider, model };
    } catch { /* Never return provider messages or credentials to the browser. */ }
  }
  throw new AIError('AI request failed. Check the configured key, model access, quota, and connection; then retry.',502);
}
