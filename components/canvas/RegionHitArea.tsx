import type {ThreeEvent} from '@react-three/fiber';
import type {BufferGeometry} from 'three';
import {useAtlasStore} from '@/store/useAtlasStore';
// Raycast geometry is a separate invisible instance of the actual anatomical surface.
// It inherits exact proportions from the GLB and contains no primitive approximations.
export default function RegionHitArea({id,geometry}:{id:string;geometry:BufferGeometry}){
 const s=useAtlasStore();
 function click(e:ThreeEvent<MouseEvent>){e.stopPropagation();if(matchMedia('(hover: none)').matches&&s.preview!==id)s.setPreview(id);else if(id==='heart'||id==='brain')s.openOrgan(id);else s.selectRegion(id);}
 return <mesh visible={false} geometry={geometry} onClick={click} onPointerOver={e=>{e.stopPropagation();if(matchMedia('(hover: hover)').matches){s.setHover(id);document.body.style.cursor='pointer'}}} onPointerOut={()=>{s.setHover(null);document.body.style.cursor='auto'}}><meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0}/></mesh>;
}
