import {organDefaults,type OrganId} from '@/lib/organs/state';
import {create} from 'zustand';
import {initialView,type ViewState,serializeURL} from '@/lib/urlState';
import {conditionById,regionById,relations,drugRelationsFor} from '@/lib/relations';
import {rememberBody,regionApplies} from '@/lib/bodies';
import type {Mode,BodySex} from '@/lib/types';
type Store=ViewState&{openOrgan:(id:OrganId)=>void;closeOrgan:()=>void;bodyNote:string|null;setBody:(body:BodySex)=>void;ready:boolean;hover:string|null;preview:string|null;cameraTick:number;patch:(v:Partial<ViewState>,replace?:boolean)=>void;hydrate:(v:ViewState)=>void;selectRegion:(id:string|null)=>void;selectCondition:(id:string)=>void;selectDrug:(id:string)=>void;setMode:(mode:Mode)=>void;back:()=>void;setHover:(id:string|null)=>void;setPreview:(id:string|null)=>void;resetCamera:()=>void};
export const useAtlasStore=create<Store>((set,get)=>({ ...initialView,bodyNote:null,ready:false,hover:null,preview:null,cameraTick:0,
 openOrgan:id=>{get().patch({...organDefaults,organ:id});set({hover:null,preview:null});},closeOrgan:()=>get().patch({...organDefaults}),
 patch:(v,replace=false)=>{set(v);if(v.body)rememberBody(v.body);if(typeof window!=='undefined'){const url=serializeURL(get());if(url!==location.pathname+location.search)history[replace?'replaceState':'pushState'](null,'',url);}},
 hydrate:v=>{rememberBody(v.body);set({...v,ready:true,hover:null,preview:null})},
 setBody:body=>{const s=get();if(s.body===body)return;const incompatible=!!s.region&&!regionApplies(s.region,body);const conditionIncompatible=!!s.condition&&conditionById[s.condition].sex!=='both'&&conditionById[s.condition].sex!==body;s.patch({body,...(incompatible?{region:null}:{}),...(incompatible||conditionIncompatible?{condition:null}:{})});set({hover:null,preview:null,bodyNote:incompatible||conditionIncompatible?'Selection cleared: that anatomy or condition is not included for the '+body+' reference body.':null})},
 selectRegion:id=>{if(id&&!regionApplies(id,get().body))get().setBody(get().body==='female'?'male':'female');set({bodyNote:null});get().patch({region:id,condition:null,drug:null,search:false,q:'',...(id==='skin'?{skin:true}:{})});set({preview:null,hover:null,cameraTick:get().cameraTick+1});},
 selectCondition:id=>{const c=conditionById[id];if(c.sex!=='both'&&c.sex!==get().body)get().setBody(c.sex);set({bodyNote:null});get().patch({expanded:true,condition:id,region:c.regionIds[0],drug:null,mode:c.mode,search:false,q:'',...(c.regionIds.includes('skin')?{skin:true}:{})});set({preview:null,hover:null,cameraTick:get().cameraTick+1});},
 selectDrug:id=>{if(!drugRelationsFor(id,get().body).conditionIds.length&&drugRelationsFor(id,get().body==='female'?'male':'female').conditionIds.length)get().setBody(get().body==='female'?'male':'female');get().patch({drug:id,condition:null,region:null,search:false,q:'',expanded:true,skin:relations[id].regionIds.includes('skin')||get().skin});set({preview:null,hover:null,cameraTick:get().cameraTick+1});},
 setMode:mode=>{get().patch({mode,condition:null,drug:null});set({preview:null,hover:null});},
 back:()=>{const s=get();if(s.drug)s.patch({drug:null});else if(s.condition)s.patch({condition:null});else s.selectRegion(s.region?regionById[s.region]?.parentId||null:null);},
 setHover:hover=>set({hover}),setPreview:preview=>set({preview}),resetCamera:()=>set({cameraTick:get().cameraTick+1})
}));
