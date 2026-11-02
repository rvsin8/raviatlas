'use client';
import type {OrganCondition,OrganDefinition} from '@/lib/organs/types';
import {useAtlasStore} from '@/store/useAtlasStore';
export default function RelatedAnatomy({organ,condition}:{organ:OrganDefinition;condition:OrganCondition}){
 const s=useAtlasStore();
 const structures=condition.anatomy.map(id=>organ.structures.find(st=>st.id===id)).filter(st=>!!st);
 if(!structures.length)return null;
 return <section className="organ-copy" aria-label="Related anatomy"><h3>Related anatomy</h3><p>Read the reference anatomy linked to this condition. These are not patient-specific findings.</p><div className="organ-chips">{structures.map(st=><button key={st.id} disabled={!st.available} title={st.available?'Read '+st.name+' anatomy':'No separately identified source geometry is available'} onClick={()=>s.patch({organStructure:st.id,organTab:'anatomy',organLayer:st.layer==='inner'?'inner':'all',organIsolate:false,organAnimation:'off',organStep:-1})}>{st.name}{!st.available?' · Unavailable':''}</button>)}</div>{structures.some(st=>!st.available)&&<small>No separately identified source mesh is available for structures marked unavailable.</small>}</section>;
}
