import {BufferGeometry,Float32BufferAttribute} from 'three';
// Never bake a transform into normalized integer attributes: setters clamp or wrap.
// Read decoded components into floating-point buffers first. Used by renderer AND verifier.
export function worldGeometry(mesh){
 const g=new BufferGeometry();
 for(const name of ['position','normal']){
  const a=mesh.geometry.getAttribute(name);if(!a)continue;
  const out=new Float32Array(a.count*3);
  for(let i=0;i<a.count;i++){out[i*3]=a.getX(i);out[i*3+1]=a.getY(i);out[i*3+2]=a.getZ(i)}
  g.setAttribute(name,new Float32BufferAttribute(out,3));
 }
 if(mesh.geometry.index)g.setIndex(mesh.geometry.index.clone());
 g.applyMatrix4(mesh.matrixWorld);g.computeBoundingBox();return g;
}
