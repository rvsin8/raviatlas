'use client';
import content from '@/data/imaging/explanations.json';
import registry from '@/data/organs/registry.json';
import {useAtlasStore} from '@/store/useAtlasStore';
import {conditionById,drugById} from '@/lib/relations';
import {ImagingSources} from './FindingExplanation';
export default function DiseaseConnections({onCatalog}:{onCatalog:(type:'condition'|'drug',id:string)=>void}){
 const s=useAtlasStore();
 function open(id:string,tab:'conditions'|'treatments'){s.patch({organTab:tab,organCondition:id,organStructure:null,organLayer:'all',organIsolate:false,organAnimation:'off',organStep:-1})}
 return <section className="imaging-disease" aria-labelledby="imaging-disease-title"><h3 id="imaging-disease-title">Disease & treatment connections</h3><p>This is a glioma teaching case. Other conditions below open their own anatomy and treatment context; this scan is not used to illustrate them.</p>{content.diseases.map(d=>{const c=registry.brain.conditions.find(c=>c.id===d.id);return <article className="imaging-disease-card" key={d.id}><header><strong>{d.name}</strong><small>{d.imaging?'Annotated MRI case available':'No annotated MRI case loaded'}</small></header><div className="imaging-link-row"><button onClick={()=>open(d.id,'conditions')}>Condition overview →</button><button onClick={()=>open(d.id,'treatments')}>Treatment context →</button></div>{!d.imaging&&<button disabled title="A verified, registered MRI and annotation pair has not been added for this disease.">Imaging unavailable</button>}{c?.catalogRefs.filter(id=>conditionById[id]).map(id=><button key={id} onClick={()=>onCatalog('condition',id)}>Open existing {conditionById[id].name} treatment panel →</button>)}{c?.drugRefs.filter(id=>drugById[id]).map(id=><button key={id} onClick={()=>onCatalog('drug',id)}>{drugById[id].generic}: existing drug profile →</button>)}</article>})}<p>{content.treatment}</p><ImagingSources urls={content.treatmentSources}/><small>The current catalog has no tumor-specific drug records. The linked NCI overview supplies general treatment context; this example does not select therapy.</small></section>
}
