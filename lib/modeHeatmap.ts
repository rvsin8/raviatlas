import type {Mode,BodySex} from './types';
import {conditions,regions,regionById,regionConditions} from './relations';
export const heatToken=(mode:Mode)=>'--heat-'+mode;
export const heatIntensity=(count:number)=>count>0?.07+.28*Math.min(1,(count-1)/4):0;
export function heatRegion(meshId:string,selected:string|null){const root=selected?(regionById[selected]?.parentId||selected):null;const id=meshId==='pectoral-surface'?'breast':meshId,top=regionById[id]?.parentId||id;return root===top?id:top;}
export function modeSummary(mode:Mode,body?:BodySex){const matching=conditions.filter(c=>c.mode===mode&&(!body||c.sex==='both'||c.sex===body)&&!c.regionIds.every(id=>id==='systemic'));const ids=new Set(matching.flatMap(c=>c.regionIds).filter(id=>id!=='systemic'));return {conditions:matching.length,regions:ids.size};}
export const heatCounts=(mode:Mode,body?:BodySex)=>Object.fromEntries(regions.filter(r=>r.id!=='systemic').map(r=>[r.id,regionConditions(r.id,mode,body).length]));
