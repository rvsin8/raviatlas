export type Vec3=[number,number,number];
export type Matrix=number[][];
export type Plane='axial'|'coronal'|'sagittal';
export const planes:Plane[]=['axial','coronal','sagittal'];
// Radiological display: patient's right on image left. Sagittal: anterior left.
export const planeAxes={axial:{u:0,v:1,s:2,labels:['R','L','A','P']},coronal:{u:0,v:2,s:1,labels:['R','L','S','I']},sagittal:{u:1,v:2,s:0,labels:['A','P','S','I']}};
export function transform(m:Matrix,p:number[]):Vec3{return m.slice(0,3).map(r=>r[0]*p[0]+r[1]*p[1]+r[2]*p[2]+r[3]) as Vec3}
export function linearIndex(p:number[],d:number[]){return p[0]+d[0]*(p[1]+d[1]*p[2])}
export function clampVoxel(p:number[],d:number[]):Vec3{return p.map((n,i)=>Math.max(0,Math.min(d[i]-1,Math.round(n)))) as Vec3}
export function pixelVoxel(plane:Plane,u:number,v:number,slice:number,d:number[]):Vec3{const a=planeAxes[plane],p=[0,0,0];p[a.u]=d[a.u]-1-u;p[a.v]=d[a.v]-1-v;p[a.s]=slice;return p as Vec3}
export function slicePixels(plane:Plane,slice:number,d:number[],signal:Uint16Array,mask:Uint8Array,window:number,level:number,opacity:number,visible:number[],colors:number[][]){const a=planeAxes[plane],w=d[a.u],h=d[a.v],pixels=new Uint8ClampedArray(w*h*4);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=linearIndex(pixelVoxel(plane,x,y,slice,d),d),value=Math.max(0,Math.min(255,255*(signal[i]-level+window/2)/Math.max(1,window))),label=mask[i],t=visible.includes(label)?opacity:0,c=colors[label]||[value,value,value],o=4*(x+y*w);for(let k=0;k<3;k++)pixels[o+k]=Math.round(value*(1-t)+c[k]*t);pixels[o+3]=255}return {pixels,width:w,height:h}}
const pending=new Map<string,Promise<ArrayBuffer>>();
export function loadVolume(url:string){let p=pending.get(url);if(!p){p=(async()=>{const response=await fetch(url,{cache:'force-cache'});if(!response.ok)throw Error(`Could not load imaging asset (${response.status})`);if(!response.body||typeof DecompressionStream==='undefined')throw Error('This browser cannot decompress MRI volumes. Use an up-to-date browser; anatomy and explanations remain available.');return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()})();pending.set(url,p);p.catch(()=>pending.delete(url))}return p}
