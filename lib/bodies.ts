import male from '@/data/hotspots-male.json';
import female from '@/data/hotspots-female.json';
import maleBounds from '@/data/model-bounds-male.json';
import femaleBounds from '@/data/model-bounds-female.json';
import type {BodySex,Sex,Condition} from './types';
export const BODY_STORAGE_KEY='rxatlas.body';
export const bodyHotspots:Record<BodySex,Record<string,string[]>>={male,female};
export const bodyBounds:Record<BodySex,Record<string,{min:number[];max:number[]}>>={male:maleBounds,female:femaleBounds};
export const regionSex:Record<string,Sex>={uterus:'female',ovaries:'female','fallopian-tubes':'female',prostate:'male',testes:'male'};
export const sexApplies=(sex:Sex|undefined,body:BodySex)=>!sex||sex==='both'||sex===body;
export const conditionApplies=(c:Condition,body:BodySex)=>sexApplies(c.sex,body);
export const regionApplies=(id:string,body:BodySex)=>sexApplies(regionSex[id],body);
export const hasGeometry=(id:string,body:BodySex)=>id==='systemic'||!!bodyHotspots[body][id]?.length;
export function rememberedBody():BodySex{try{return localStorage.getItem(BODY_STORAGE_KEY)==='female'?'female':'male'}catch{return'male'}}
export function rememberBody(body:BodySex){try{localStorage.setItem(BODY_STORAGE_KEY,body)}catch{/* Storage can be disabled; URL remains authoritative. */}}
