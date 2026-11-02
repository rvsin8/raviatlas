import {regionSex} from './bodies';
import MiniSearch from 'minisearch';
import {conditions,drugs,regions} from './relations';
export const searchIndex=new MiniSearch({fields:['name','aliases'],storeFields:['name','kind','detail','sex'],searchOptions:{prefix:true,fuzzy:.2,boost:{name:2}}});
export function drugSex(id:string){const cs=conditions.filter(c=>c.drugIds.includes(id));return cs.length&&cs.every(c=>c.sex==='female')?'female':cs.length&&cs.every(c=>c.sex==='male')?'male':'both'}
searchIndex.addAll([...regions.map(r=>({id:"region:"+r.id,name:r.name,kind:"region",detail:"Body region",sex:regionSex[r.id]||"both",aliases:""})),...conditions.map(c=>({id:'condition:'+c.id,name:c.name,kind:'condition',detail:c.mode,sex:c.sex,aliases:''})),...drugs.map(d=>({id:'drug:'+d.id,name:d.generic,kind:'drug',detail:d.drugClass,sex:drugSex(d.id),aliases:d.brands.join(' ')}))]);

searchIndex.add({id:'deep:aortic-dissection',name:'Aortic dissection · 3D deep dive',kind:'deep',detail:'Interactive anatomy',aliases:'aorta Stanford DeBakey tear true false lumen'});

searchIndex.add({id:'deep:dvt-pe',name:'DVT → pulmonary embolism · 3D deep dive',kind:'deep',detail:'Interactive anatomy',aliases:'deep vein thrombosis clot PE lungs calf'});
searchIndex.add({id:'deep:asthma',name:'Asthma attack · 3D deep dive',kind:'deep',detail:'Interactive anatomy',aliases:'airway inhaler albuterol bronchiole wheeze'});
