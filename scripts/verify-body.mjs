import fs from 'node:fs';
import crypto from 'node:crypto';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'meshoptimizer';
import {Box3,Vector3} from 'three';
import {worldGeometry} from '../lib/model/worldGeometry.mjs';
await MeshoptDecoder.ready;
const source=JSON.parse(fs.readFileSync('data/model-reports/source-part-bounds.json'));
const approval=JSON.parse(fs.readFileSync('data/model-reports/approved-source-asymmetry.json'));
const sourceHash=crypto.createHash('sha256').update(fs.readFileSync('data/model-reports/source-part-bounds.json')).digest('hex');
const byId=Object.fromEntries(source.map(p=>[p.fileId,p]));
const regs=JSON.parse(fs.readFileSync('data/regions.json')).regions;
const bytes=fs.readFileSync('public/models/rxatlas-anatomy.glb');
const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
gltf.scene.updateMatrixWorld(true);
const failures=[],parts={},regions={},areas={},body=new Box3();let checked=0,maxExpansion=0;
if(sourceHash!==approval.sourceBoundsSha256)failures.push('Source bounds changed; documented asymmetry approval must be reviewed');
const boxArray=b=>({min:b.min.toArray(),max:b.max.toArray()});
gltf.scene.traverse(o=>{
 if(!o.isMesh)return;
 const geom=worldGeometry(o),b=geom.boundingBox;body.union(b);
 const pos=geom.getAttribute('position'),ix=geom.index,ids=o.geometry.getAttribute('_source_part');
 if(!ids){failures.push('Missing per-vertex source identity: '+o.name);return;}
 const point=new Vector3();for(let i=0;i<pos.count;i++){const src=source[Math.round(ids.getX(i))];if(!src){failures.push('Invalid source index');continue;}(parts[src.fileId]??=new Box3()).expandByPoint(point.fromBufferAttribute(pos,i));}
 const rid=o.userData.regionId||o.parent.userData.regionId;
 let area=0,weightedY=0;const va=new Vector3(),vb=new Vector3(),vc=new Vector3(),ab=new Vector3(),ac=new Vector3();
 for(let i=0;i<ix.count;i+=3){va.fromBufferAttribute(pos,ix.getX(i));vb.fromBufferAttribute(pos,ix.getX(i+1));vc.fromBufferAttribute(pos,ix.getX(i+2));const ar=ab.subVectors(vb,va).cross(ac.subVectors(vc,va)).length()/2;area+=ar;weightedY+=ar*(va.y+vb.y+vc.y)/3;}
 for(const r of regs)if(r.meshIds.includes(rid)){(regions[r.id]??=new Box3()).union(b);const a=areas[r.id]??={area:0,y:0};a.area+=area;a.y+=weightedY;}
 geom.dispose();
});
for(const src of source){const b=parts[src.fileId];if(!b){failures.push('Missing rendered part '+src.fileId);continue;}
 const dims=b.getSize(new Vector3()).toArray(),s=src.worldBounds[1].map((x,j)=>x-src.worldBounds[0][j]);
 for(let j=0;j<3;j++){
  const ratio=dims[j]/Math.max(s[j],1e-9);maxExpansion=Math.max(maxExpansion,ratio);
  if(dims[j]>s[j]*1.2+1e-6)failures.push(`${src.fileId} axis ${j} expanded ${ratio.toFixed(5)}x`);
  if(b.min.getComponent(j)<src.worldBounds[0][j]-.00015||b.max.getComponent(j)>src.worldBounds[1][j]+.00015)failures.push(`${src.fileId} left its source shape bounds on axis ${j}`);
 }checked++;
}
const dimensions=body.getSize(new Vector3()).toArray();
for(const [i,min,max,name] of [[0,.4,.9,'width'],[1,1.6,1.85,'height'],[2,.2,.4,'depth']])if(dimensions[i]<min||dimensions[i]>max)failures.push(`${name} ${dimensions[i]} outside ${min}–${max}m`);
// 'Near zero' is reported explicitly; no origin shift is applied to source feet at -0.078m.
if(Math.abs(body.min.y)>.1||Math.abs(body.max.y-1.7)>.1)failures.push('Feet/head do not lie near specified elevations');
const order=['head','neck','chest','abdomen','pelvis','thigh','knee','foot'];const centroidY=Object.fromEntries(order.map(r=>[r,areas[r]?.y/areas[r]?.area]));
for(let i=1;i<order.length;i++)if(!(centroidY[order[i-1]]>centroidY[order[i]]))failures.push(`Centroid order ${order[i-1]} > ${order[i]} failed`);
const labels={};for(const p of source){const l=p.sourceName||p.labels.find(x=>/^(left|right) /i.test(x));if(l&&/^(left|right) /i.test(l))(labels[l.toLowerCase()]??=[]).push(p.fileId);}
let pairs=0,maxMirrorError=0;const asymmetric=[];
for(const [label,fids] of Object.entries(labels)){
 if(!label.startsWith('left '))continue;const others=labels['right '+label.slice(5)];if(!others)continue;
 const lbox=new Box3(),rbox=new Box3(),lsource=new Box3(),rsource=new Box3();
 for(const [ids,target,raw] of [[fids,lbox,lsource],[others,rbox,rsource]])for(const fid of ids){if(parts[fid])target.union(parts[fid]);const s=byId[fid].worldBounds;raw.union(new Box3(new Vector3().fromArray(s[0]),new Vector3().fromArray(s[1])));}
 if(lbox.isEmpty()||rbox.isEmpty())continue;
 const mirrorError=(a,b)=>Math.max(Math.abs(a.min.x+b.max.x),Math.abs(a.max.x+b.min.x),Math.abs(a.min.y-b.min.y),Math.abs(a.max.y-b.max.y),Math.abs(a.min.z-b.min.z),Math.abs(a.max.z-b.max.z));
 const delta=(a,b)=>[a.min.x+b.max.x,a.max.x+b.min.x,a.min.y-b.min.y,a.max.y-b.max.y,a.min.z-b.min.z,a.max.z-b.max.z];
 const rawDelta=delta(lsource,rsource),rebuiltDelta=delta(lbox,rbox);
 const introducedMirrorDeviationM=Math.max(...rebuiltDelta.map((v,i)=>Math.abs(v-rawDelta[i])));
 const error=mirrorError(lbox,rbox);pairs++;maxMirrorError=Math.max(maxMirrorError,error);
 if(error>.03)asymmetric.push({left:fids,right:others,name:label.slice(5),mirrorBoundsErrorM:error,sourceMirrorBoundsErrorM:mirrorError(lsource,rsource),introducedMirrorDeviationM});
}
for(const pair of asymmetric){
 const approved=approval.pairs.find(p=>p.name===pair.name&&JSON.stringify(p.left)===JSON.stringify(pair.left)&&JSON.stringify(p.right)===JSON.stringify(pair.right));
 if(!approved||Math.abs(approved.sourceMirrorBoundsErrorM-pair.sourceMirrorBoundsErrorM)>1e-9){failures.push('Undocumented source asymmetry: '+pair.name);continue;}
 if(pair.introducedMirrorDeviationM>approval.maximumIntroducedMirrorDeviationM)failures.push('Introduced mirror deformation exceeds 1 mm: '+pair.name);
}

const lateral=[];for(const p of source){if(!['upper-arm','forearm','palm','fingers-thumb','wrist','hand'].includes(p.regionId))continue;const label=p.labels.find(x=>/^(left|right) /i.test(x));if(!label||!parts[p.fileId])continue;const center=parts[p.fileId].getCenter(new Vector3());lateral.push(center.x);if(Math.abs(center.x)<.10)failures.push(`${p.fileId} arm/hand center overlaps torso midline`);}
if(bytes.byteLength>=15000000)failures.push('GLB exceeds 15 MB');
const report={glbBytes:bytes.byteLength,centroidDefinition:'Surface-area-weighted triangle centroid',pass:failures.length===0,transform:'(x,y,z) mm -> (.001*x,.001*z,-.001*y) m; no translation',wholeModel:boxArray(body),dimensionsM:{width:dimensions[0],height:dimensions[1],depth:dimensions[2]},centroidY,sourceParts:source.length,decodedRenderedParts:checked,maximumSourceDimensionRatio:maxExpansion,armHandCentroidXRange:[Math.min(...lateral),Math.max(...lateral)],leftRightPairs:pairs,maxMirrorBoundsErrorM:maxMirrorError,asymmetricPairs:asymmetric,symmetryPolicy:{strictToleranceM:.03,approvedSourcePairs:approval.pairs.length,maximumIntroducedMirrorDeviationM:approval.maximumIntroducedMirrorDeviationM,sourceBoundsSha256:sourceHash},failures};
fs.writeFileSync('data/model-reports/verify-body.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,asymmetricPairs:asymmetric.slice(0,8)},null,2));
if(failures.length)process.exit(1);
