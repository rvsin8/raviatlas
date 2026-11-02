import {useEffect,useRef} from 'react';
import {CameraControls} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {Box3,Vector3} from 'three';
import {useAtlasStore} from '@/store/useAtlasStore';
import {regionById} from '@/lib/relations';
import {displayRegion} from '@/lib/anatomy';
import {bodyBounds} from '@/lib/bodies';
export default function CameraRig(){
 const ref=useRef<CameraControls>(null),{body,region,drug,condition,cameraTick,mode,organ}=useAtlasStore(),{invalidate,size}=useThree();
 const saved=useRef<string|null>(null);
 useEffect(()=>{const c=ref.current;if(!c)return;if(organ){if(!saved.current)saved.current=c.toJSON();c.stop();c.enabled=false;}else {c.enabled=true;if(saved.current){c.fromJSON(saved.current,false);saved.current=null;invalidate();}}},[organ,invalidate]);
 const lastBody=useRef(body),lastTick=useRef(cameraTick);
 const lastMode=useRef(mode),lastRegion=useRef(region);
 useEffect(()=>{
  if(useAtlasStore.getState().organ)return;
  const tickChanged=lastTick.current!==cameraTick;lastTick.current=cameraTick;const bodyChanged=lastBody.current!==body;lastBody.current=body;const sameRegion=lastRegion.current===region;lastRegion.current=region;const modeChanged=lastMode.current!==mode;lastMode.current=mode;if(bodyChanged&&!tickChanged&&(sameRegion||!region)){ref.current?.stop();return;}if(modeChanged&&sameRegion)return;const bounds=bodyBounds[body];
  const controls=ref.current;if(!controls)return;
  const id=region&&!drug&&region!=='systemic'?(displayRegion(region,condition,body)||'body'):'body';
  const b=bounds[id]||bounds[regionById[id]?.parentId||'body']||bounds.body;
  const box=new Box3(new Vector3().fromArray(b.min),new Vector3().fromArray(b.max)),extent=box.getSize(new Vector3());
  // Padding is derived from the actual surface extent, never hand-tuned positions.
  const padding=id==='body'?.15:.2;
  const animate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  controls.rotateTo(id==='back'||regionById[id]?.parentId==='back'?Math.PI:0,Math.PI/2,animate);
  controls.fitToBox(box,animate,{paddingTop:extent.y*padding,paddingBottom:extent.y*padding,paddingLeft:extent.x*padding,paddingRight:extent.x*padding,cover:false});invalidate();
 },[body,region,drug,condition,cameraTick,mode,size.width,size.height,invalidate]);
 return <CameraControls ref={ref} makeDefault minDistance={.005} maxDistance={40} smoothTime={.65} draggingSmoothTime={.15} onChange={()=>invalidate()} onTransitionStart={()=>invalidate()} onUpdate={()=>invalidate()} minPolarAngle={.2} maxPolarAngle={Math.PI-.2}/>;
}
