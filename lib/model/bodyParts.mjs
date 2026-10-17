import {BufferGeometry,Float32BufferAttribute} from 'three';
import {worldGeometry} from './worldGeometry.mjs';
// Partition existing source triangles only. Coordinates and the original GLB are untouched.
export function bodyParts(mesh,id,body,sourceParts){
 const world=worldGeometry(mesh),source=mesh.geometry.getAttribute('_source_part');
 if(body!=='male'||!source||!['unmapped','reproductive-organs'].includes(id))return [{id,geometry:world}];
 const lookup=new Map(Object.entries(sourceParts).flatMap(([r,ids])=>ids.map(i=>[i,r]))),groups=new Map(),index=world.index;
 for(let i=0;i<(index?.count||world.attributes.position.count);i+=3){const vertices=[0,1,2].map(j=>index?index.getX(i+j):i+j),region=lookup.get(source.getX(vertices[0]))||id;if(!groups.has(region))groups.set(region,[]);groups.get(region).push(...vertices)}
 if(groups.size===1&&!groups.has('prostate')&&!groups.has('testes'))return [{id,geometry:world}];
 const result=[];for(const [region,indices]of groups){const geometry=new BufferGeometry(),remap=new Map(),unique=[];const compact=indices.map(i=>{if(!remap.has(i)){remap.set(i,unique.length);unique.push(i)}return remap.get(i)});for(const name of ['position','normal']){const attr=world.getAttribute(name);if(!attr)continue;const data=new Float32Array(unique.length*3);unique.forEach((old,i)=>data.set([attr.getX(old),attr.getY(old),attr.getZ(old)],i*3));geometry.setAttribute(name,new Float32BufferAttribute(data,3))}geometry.setIndex(compact);geometry.computeBoundingBox();result.push({id:region,geometry})}world.dispose();return result;
}
