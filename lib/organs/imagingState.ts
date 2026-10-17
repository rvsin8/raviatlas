export type ImagingState={imageVoxel:[number,number,number]|null;imageSequence:number;imageFinding:number;imageClasses:number[];imageOpacity:number;imageCompare:boolean;imagePlanes:boolean;imageContext:boolean};
export const imagingDefaults:ImagingState={imageVoxel:null,imageSequence:0,imageFinding:3,imageClasses:[1,2,3],imageOpacity:.55,imageCompare:false,imagePlanes:true,imageContext:true};
export function parseImaging(p:URLSearchParams):ImagingState{
 const v={...imagingDefaults,imageClasses:[...imagingDefaults.imageClasses]};
 const xyz=p.get('voxel')?.split(',').map(Number);if(xyz?.length===3&&xyz.every(n=>Number.isInteger(n)&&n>=0&&n<2048))v.imageVoxel=xyz as [number,number,number];
 v.imageSequence=p.get('sequence')==='flair'?1:0;
 const f=Number(p.get('finding'));if([1,2,3].includes(f))v.imageFinding=f;
 if(p.has('classes'))v.imageClasses=(p.get('classes')||'').split(',').map(Number).filter((n,i,a)=>[1,2,3].includes(n)&&a.indexOf(n)===i);
 const a=Number(p.get('overlay'));if(p.has('overlay')&&Number.isFinite(a))v.imageOpacity=Math.max(0,Math.min(1,a));
 v.imageCompare=p.get('compare')==='1';v.imagePlanes=p.get('planes')!=='0';v.imageContext=p.get('context')!=='0';return v;
}
export function writeImaging(p:URLSearchParams,v:ImagingState){if(v.imageVoxel)p.set('voxel',v.imageVoxel.join(','));if(v.imageSequence===1)p.set('sequence','flair');p.set('finding',String(v.imageFinding));if(v.imageClasses.join(',')!=='1,2,3')p.set('classes',v.imageClasses.join(','));if(v.imageOpacity!==.55)p.set('overlay',String(v.imageOpacity));if(v.imageCompare)p.set('compare','1');if(!v.imagePlanes)p.set('planes','0');if(!v.imageContext)p.set('context','0');}
