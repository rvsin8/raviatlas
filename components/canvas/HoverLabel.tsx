import {bodyBounds} from '@/lib/bodies';
import {Html} from '@react-three/drei';
import {useAtlasStore} from '@/store/useAtlasStore';
import {regionById,regionConditions} from '@/lib/relations';
export default function HoverLabel(){const {hover,preview,mode,body,selectRegion,openOrgan}=useAtlasStore();const id=preview||hover;if(!id)return null;const r=regionById[id];if(!r)return null;const b=bodyBounds[body][id],position=b?b.min.map((v,i)=>(v+b.max[i])/2):r.position;return <Html position={[position[0]+.25,position[1]+.12,position[2]+.2]} center zIndexRange={[30,0]}><div className="hover-label"><strong>{r.name} · {regionConditions(id,mode,body).length} {mode==='injury'?(regionConditions(id,mode,body).length===1?'injury':'injuries'):mode+(regionConditions(id,mode,body).length===1?'':'s')}</strong>{preview&&<button onClick={()=>id==='heart'||id==='brain'?openOrgan(id):selectRegion(id)}>Open {id==='heart'||id==='brain'?'explorer':'region'} →</button>}</div></Html>}
