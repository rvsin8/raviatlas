'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
function Part({position,scale,color='#c98e7d'}:{position:[number,number,number],scale:[number,number,number],color?:string}){
 return <mesh position={position} scale={scale}><capsuleGeometry args={[.45,1,16,32]}/><meshStandardMaterial color={color} roughness={.65}/></mesh>
}
export default function BodyViewer(){
 const floor=useMemo(()=>new THREE.Color('#eef5f3'),[])
 return <div className="viewerCanvas"><Canvas camera={{position:[0,0.4,8],fov:34}} shadows>
  <color attach="background" args={[floor]}/><ambientLight intensity={1.4}/><directionalLight position={[4,6,5]} intensity={2.2}/>
  <group position={[0,-.25,0]}>
   <mesh position={[0,2.15,0]}><sphereGeometry args={[.55,32,32]}/><meshStandardMaterial color="#cfa28f"/></mesh>
   <Part position={[0,.75,0]} scale={[1.25,1.35,.72]} color="#d79b8a"/>
   <Part position={[-1.25,.65,0]} scale={[.38,1.45,.38]} color="#a45f5e"/>
   <Part position={[1.25,.65,0]} scale={[.38,1.45,.38]} color="#a45f5e"/>
   <Part position={[-.52,-1.55,0]} scale={[.5,1.7,.5]} color="#b8756b"/>
   <Part position={[.52,-1.55,0]} scale={[.5,1.7,.5]} color="#b8756b"/>
   <mesh position={[0,.6,.65]} scale={[.2,2.1,.15]}><boxGeometry/><meshStandardMaterial color="#e6d9c7"/></mesh>
  </group>
  <OrbitControls enablePan={false} minDistance={5.5} maxDistance={10}/>
 </Canvas></div>
}