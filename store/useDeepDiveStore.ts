'use client';
import {pulseSettings} from '@/lib/deep-dive/pulse';
import {create} from 'zustand';
import {initialDive,parseDive,diveURL} from '@/lib/deep-dive/state';
import type {DiveState,SegmentId} from '@/lib/deep-dive/types';
export type SceneState=DiveState&{preset:'A'|'B'|null;rupture:number|null;focus:'overview'|'segment'|'tear'|'body'|'cross'|'rupture';branches:boolean;sources:boolean;compare:boolean;action:string;revision:number};
export const defaults:SceneState={...initialDive,preset:null,rupture:null,focus:'overview',branches:false,sources:false,compare:false,action:'overview',revision:0};
export const ruptureLocation=(t:number)=>t<.109375?'Pericardial space':t<.653125?'Left chest cavity':'Retroperitoneal space';
type Machine={phase:number;stressSeconds:number;growth:number;flash:number;ready:boolean;view:SceneState;clock:number;progress:number;time:number;hint:string;preview:number|null;patch:(v:Partial<SceneState>)=>void;preset:(v:'A'|'B')=>void;place:(t:number)=>void;reset:()=>void;step:(n:number)=>void;scrub:(t:number)=>void;tick:(dt:number)=>void;restore:(search:string)=>void;previewAt:(t:number|null)=>void};
export const useDeepDiveStore=create<Machine>((set,get)=>({phase:0,stressSeconds:0,growth:0,flash:0,ready:false,view:{...defaults},clock:0,progress:0,time:0,hint:'',preview:null,
patch(p){const old=get().view,v={...old,...p,action:Object.keys(p)[0]||'overview',revision:old.revision+1};let progress=get().progress;
 if(p.segment){v.focus='segment';v.journey=false;v.cross=false;v.tool='inspect';v.step=v.dissection?2:0;v.sheet=false}
 if(p.tool&&p.tool!=='inspect'){v.focus='overview';v.cross=false;v.journey=false;v.sheet=false;v.segment=null}
 if(p.entry!==undefined&&p.entry!==null){v.dissection=true;v.focus='tear';v.segment=null;v.cross=false;v.journey=false;v.tool='inspect';v.playing=true;v.step=1;v.preset=null;v.rupture=null;v.extent=Math.max(p.entry+.01,v.extent);progress=0}
 if(p.dissection===false){v.tool='inspect';v.rupture=null;v.preset=null;v.compare=false;v.segment=null;v.cross=false;v.journey=false;v.step=0;v.focus='overview'}
 if(p.dissection===true){v.focus='tear';v.step=1;progress=0}
 if(p.dissection===true&&v.entry===null){v.entry=.05;progress=0;v.step=1;v.focus='tear'}
 if(p.journey!==undefined){v.focus=p.journey?'body':'overview';v.segment=null;v.cross=false;v.step=p.journey&&v.dissection?4:v.dissection?2:0}
 if(p.cross!==undefined){v.focus=p.cross?'cross':'overview';v.journey=false;v.segment=null;v.step=p.cross?3:v.dissection?2:0}
 if(p.slice!==undefined){v.focus='cross';v.cross=true}
 if(p.load!==undefined){v.load=Math.max(0,Math.min(1,p.load));v.rate=v.load*2;v.pressure=v.load*2;v.step=v.dissection?4:0}
 if(p.rate!==undefined||p.pressure!==undefined){v.journey=false;v.focus='tear';v.cross=false;v.segment=null;v.step=v.dissection?4:0}
 if(p.depth){v.focus=p.depth==='clinical'?'body':p.depth==='detailed'?'cross':'overview';v.journey=p.depth==='clinical';v.cross=p.depth==='detailed';v.sheet=true}
 if(p.branches!==undefined){v.focus='overview';v.journey=false;v.cross=false}
 if(p.sources!==undefined){v.focus=p.sources?'body':'overview';v.cross=false}
 if(p.tamponade!==undefined||p.regurgitation!==undefined||p.coronary!==undefined){v.focus='tear';v.journey=false;v.cross=false}
 if(p.extent!==undefined){v.extent=Math.max(v.entry??0,p.extent);if(p.entry===undefined){v.focus='overview';v.segment=null;v.cross=false;v.journey=false}}
 if(p.compare!==undefined){v.focus='overview';v.cross=false;v.journey=false;v.segment=null;v.tool='inspect';v.rupture=null;v.sheet=false;if(p.compare){v.dissection=true;v.entry=.055;v.extent=1;v.playing=true;progress=0}}
 if(p.segment||p.tool||p.entry!==undefined||p.journey||p.cross||p.depth)v.compare=false;
 if(Object.keys(p).every(k=>['playing','speed','theme','load','sound'].includes(k)))v.revision=old.revision;
 if(p.extent!==undefined&&v.rupture!==null&&v.rupture>v.extent){v.rupture=null;v.focus='overview'}
 if(p.playing===true&&v.rupture!==null&&get().time>=12){set({time:0,clock:0});v.revision=old.revision+1}
 set({view:v,progress,...(p.entry!==undefined?{growth:0,flash:0,stressSeconds:0}:{}),...(p.load!==undefined&&p.load<.875?{stressSeconds:0}:{}),...(p.load!==undefined&&p.load<=.375?{flash:0}:{}),hint:'',preview:p.tool&&p.tool!=='inspect'?(v.entry??.17):null})},
preset(type){get().patch({entry:type==='A'?.055:.227,extent:1,dissection:true,playing:true,sheet:false,depth:'basics'});set({phase:0,stressSeconds:0,growth:0,flash:0,view:{...get().view,preset:type,focus:'tear',sheet:false,action:'preset',compare:false},time:0,progress:0})},
place(t){const s=get();if(s.view.tool==='rupture'){if(!s.view.dissection||s.view.entry===null||t<s.view.entry||t>s.view.extent){set({hint:'Rupture happens in the dissected wall. Choose a highlighted area.'});return}set({view:{...s.view,rupture:t,focus:'rupture',tool:'inspect',playing:true,journey:false,cross:false,segment:null,sheet:false,revision:s.view.revision+1},time:0,clock:0,progress:1,preview:null,hint:''})}else get().patch({entry:Math.min(.985,t),dissection:true})},
reset(){set({view:{...defaults,theme:get().view.theme,revision:get().view.revision+1},phase:0,stressSeconds:0,growth:0,flash:0,clock:0,time:0,progress:0,hint:'',preview:null})},
step(n){n=Math.max(0,Math.min(4,n));if(n===0)get().patch({dissection:false,journey:false,cross:false,segment:null,focus:'overview',step:0});else {if(get().view.entry===null)get().preset('A');get().patch({dissection:true,segment:null,cross:n===3,journey:n===4,focus:n===1?'tear':n===3?'cross':n===4?'body':'overview',step:n});set({progress:n===1?0:1,view:{...get().view,cross:n===3,journey:n===4,step:n,focus:n===1?'tear':n===3?'cross':n===4?'body':'overview'}})}},
scrub(t){t=Math.max(0,Math.min(12,t));set({time:t,clock:t,view:{...get().view,playing:false,focus:'rupture',revision:get().view.revision+1}})},
tick(dt){const s=get();if(!s.view.playing)return;const d=Math.min(Math.max(dt,0),.5)*s.view.speed,t=s.view.rupture===null?0:Math.min(12,s.time+d),cfg=pulseSettings(s.view.load),phase=s.phase+d*cfg.frequency*(1+Math.max(0,(t-9)/3)*.5),newBeat=Math.floor(phase)-Math.floor(s.phase),growing=s.view.dissection&&s.view.rupture===null&&cfg.growth>0,increment=growing?(s.view.load<.625?cfg.growth*d:newBeat?cfg.growth*newBeat:0):0;set({phase,stressSeconds:s.view.load>=.875&&s.view.dissection?s.stressSeconds+d:0,growth:Math.min(.25,s.growth+increment),flash:increment>0&&s.view.load>=.625?1:Math.max(0,s.flash-d*5),clock:s.view.rupture===null?s.clock+d:t,time:t,progress:s.view.dissection?Math.min(1,s.progress+d/2.5):Math.max(0,s.progress-d),...(t===12?{view:{...s.view,playing:false}}:{})})},
restore(search){const p=new URLSearchParams(search),v={...defaults,...parseDive(search)};for(const k of ['branches','sources','compare'] as const)v[k]=p.get(k)==='1';const r=Number(p.get('rupture'));if(p.has('rupture')&&Number.isFinite(r)&&v.dissection&&r>=(v.entry??0)&&r<=v.extent)v.rupture=r;const f=p.get('focus');if(['overview','segment','tear','body','cross','rupture'].includes(f||''))v.focus=f as SceneState['focus'];else v.focus=v.rupture!==null?'rupture':v.journey?'body':v.cross?'cross':v.segment?'segment':'overview';v.preset=p.get('preset')==='A'?'A':p.get('preset')==='B'?'B':null;if(v.dissection&&v.step===0)v.step=v.journey?4:v.cross?3:2;const time=Math.max(0,Math.min(12,Number(p.get('time'))||0));set({view:{...v,revision:get().view.revision+1},time,clock:time,phase:Math.max(0,Number(p.get('phase'))||0),growth:Math.max(0,Math.min(.25,Number(p.get('growth'))||0)),stressSeconds:0,flash:0,progress:p.has('progress')?Math.max(0,Math.min(1,Number(p.get('progress'))||0)):v.dissection?1:0,hint:'',preview:null})},
previewAt(preview){set({preview})}
}));
export function sceneURL(){const s=useDeepDiveStore.getState(),p=new URLSearchParams(diveURL(s.view).split('?')[1]);for(const k of ['preset','rupture','focus','branches','sources','compare'] as const){const v=s.view[k];if(v!==defaults[k]&&v!==null)p.set(k,typeof v==='boolean'?(v?'1':'0'):String(v));else p.delete(k)}p.delete('revision');p.delete('action');if(typeof location!=='undefined'&&new URLSearchParams(location.search).get('debug')==='1')p.set('debug','1');if(s.view.rupture!==null)p.set('time',s.time.toFixed(3));if(s.view.dissection){p.set('progress',s.progress.toFixed(3));if(s.growth)p.set('growth',s.growth.toFixed(5))}if(s.phase)p.set('phase',s.phase.toFixed(4));return '/deep-dive/aortic-dissection/?'+p.toString()}
