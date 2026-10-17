import {ChevronRight} from 'lucide-react';
import {useAtlasStore} from '@/store/useAtlasStore';
import {regionById} from '@/lib/relations';
export default function Breadcrumb(){const {region,selectRegion,drug}=useAtlasStore();const r=region?regionById[region]:null;return <nav className="breadcrumb" aria-label="Body navigation"><button onClick={()=>selectRegion(null)}>Body</button>{r?.parentId&&<><ChevronRight size={13}/><button onClick={()=>selectRegion(r.parentId)}>{regionById[r.parentId].name}</button></>}{r&&<><ChevronRight size={13}/><span>{r.name}</span></>}{drug&&<><ChevronRight size={13}/><span>Drug map</span></>}</nav>}
