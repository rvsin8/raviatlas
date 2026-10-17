import {bodyHotspots} from './bodies';
import type {BodySex} from './types';
import {conditionById,regionById} from './relations';
// A regional locator does not claim that unmodeled anatomy is present.
export const femaleCondition=(id:string|null)=>!!id&&conditionById[id]?.anatomyContext==='female';
export function displayRegion(region:string|null,condition:string|null,body:BodySex='male'){if(body==='female')return region;return region==='reproductive-organs'&&femaleCondition(condition)?'pelvis':region;}
export function meshIdsFor(region:string|null,condition:string|null=null,body:BodySex='male'){return bodyHotspots[body][displayRegion(region,condition,body)||'']||[];}
