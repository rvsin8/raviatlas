export type VolumeAsset={bytes:number;sha256:string;decodedBytes:number};
type Dependencies={fetcher?:typeof fetch;timeoutMs?:number};
/** One bounded, deduplicated cache for explicitly registered static volumes. */
export function createVolumeLoader(assets:Record<string,VolumeAsset>,{fetcher=fetch,timeoutMs=30000}:Dependencies={}){
 const pending=new Map<string,Promise<ArrayBuffer>>();
 const failed=new Set<string>();
 return function load(url:string):Promise<ArrayBuffer>{
  const asset=assets[url];if(!asset)return Promise.reject(new Error('Unregistered imaging asset'));
  const cached=pending.get(url);if(cached)return cached;
  const task=(async()=>{
   if(globalThis.isSecureContext===false)throw Error('MRI integrity verification requires HTTPS. Open the published HTTPS site, or use localhost for local development. Anatomy and reference explanations remain available.');
   if(typeof DecompressionStream==='undefined'||!globalThis.crypto?.subtle)throw Error('This browser cannot securely decode MRI volumes. Use a current browser; anatomy and explanations remain available.');
   const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),timeoutMs);
   try{
    // A bad response may be cached by the browser even though our decoded
    // cache rejected it. A user retry must refresh those bytes from the server.
    const response=await fetcher(`${url}?v=${asset.sha256.slice(0,16)}`,{cache:failed.has(url)?'reload':'force-cache',signal:controller.signal});
    if(!response.ok)throw Error(`Could not load imaging asset (${response.status})`);
    const compressed=await response.arrayBuffer();
    if(compressed.byteLength!==asset.bytes)throw Error('Imaging asset size mismatch. Retry loading the verified case.');
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',compressed)),n=>n.toString(16).padStart(2,'0')).join('');
    if(hash!==asset.sha256)throw Error('Imaging asset integrity check failed. The mismatched scan was not displayed.');
    const reader=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
    const output=new Uint8Array(asset.decodedBytes);let offset=0;
    try{while(true){const {done,value}=await reader.read();if(done)break;if(offset+value.byteLength>output.length)throw Error('Decoded MRI exceeds its calibrated dimensions');output.set(value,offset);offset+=value.byteLength;}}
    finally{await reader.cancel().catch(()=>{});reader.releaseLock()}
    if(offset!==output.length)throw Error('Decoded MRI dimensions do not match the case');
    failed.delete(url);return output.buffer;
   }catch(error){if(controller.signal.aborted)throw Error('MRI loading timed out. Check your connection and retry.');throw error}
   finally{clearTimeout(timeout)}
  })();
  pending.set(url,task);void task.catch(()=>{if(pending.get(url)===task){failed.add(url);pending.delete(url)}});return task;
 }
}
