'use client';
import {useMemo,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import * as T from 'three';
import {useDeepDiveStore} from '@/store/useDeepDiveStore';
import {beat} from '@/lib/deep-dive/pulse';
import {frame,type AortaPath} from '@/lib/deep-dive/geometry';
import {themeToken} from '@/lib/theme';
/** Diagram arrows, not anatomical geometry. */
export default function PulseForces({path}:{path:AortaPath}){const wave=useMemo(()=>new T.BufferGeometry().setAttribute('position',new T.BufferAttribute(new Float32Array(64*3),3)),[]);const sound=useDeepDiveStore(s=>s.view.sound);const arrows=useMemo(()=>Array.from({length:3},()=>{const arrow=new T.ArrowHelper(new T.Vector3(1,0,0),new T.Vector3(),.02);for(const part of [arrow.line,arrow.cone]){(part.material as T.Material).depthTest=false;part.renderOrder=30}return arrow}),[]);useEffect(()=>()=>arrows.forEach(a=>{a.line.geometry.dispose();a.cone.geometry.dispose()}),[arrows]);useFrame(()=>{const {view:s,phase,growth}=useDeepDiveStore.getState(),f=frame(path,Math.min(s.extent,(s.entry??0)+growth)),b=beat(phase),color=new T.Color(themeToken('--accent')).lerp(new T.Color(themeToken('--pulse-danger')),s.load);const pos=wave.getAttribute('position'),root=path.at(0);for(let i=0;i<64;i++)pos.setXYZ(i,root.x-.06+i/63*.04,root.y+.04+Math.sin(i*.6+phase*6.28)*.002,root.z);pos.needsUpdate=true;arrows.forEach((a,i)=>{a.visible=s.dissection;a.position.copy(f.p).addScaledVector(f.axis,(i-1)*.006);a.setDirection(f.n);a.setLength(.008+s.load*.035+b*s.load*.012,.006,.004);a.setColor(color)})});return <group><lineLoop geometry={wave} visible={sound} renderOrder={30}><lineBasicMaterial color={themeToken('--accent')} transparent depthTest={false}/></lineLoop>{arrows.map((a,i)=><primitive object={a} key={i}/>)}</group>}
