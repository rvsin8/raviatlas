import fs from 'node:fs';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder,MeshoptEncoder} from 'meshoptimizer';
import {Document,NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {meshopt} from '@gltf-transform/functions';
import {worldGeometry} from '../../lib/model/worldGeometry.mjs';
await Promise.all([MeshoptDecoder.ready,MeshoptEncoder.ready]);
const sources=JSON.parse(fs.readFileSync('data/model-reports/source-part-bounds.json'));
const ids={ascending:['FJ3413'],arch:['FJ3411'],descending:['FJ1931'],abdominal:['FJ1932'],brachiocephalic:['FJ3417'],leftCarotid:['FJ3483'],leftSubclavian:['FJ3479'],celiac:['FJ3421'],sma:['FJ1928'],rightRenal:['FJ2038'],leftRenal:['FJ2046'],rightIliac:['FJ3565'],leftIliac:['FJ3464']};
// Extend flow along existing arterial anatomy, never invented organ meshes.
for(const [key,pattern] of Object.entries({rightCarotid:/^Right common carotid artery$/i,rightSubclavian:/^Right subclavian artery$/i,leftArm:/^Left (axillary|brachial) artery$/i,rightArm:/^Right (axillary|brachial) artery$/i,leftLeg:/^Left (external iliac|femoral) artery$/i,rightLeg:/^Right (external iliac|femoral) artery$/i,coronary:/coronary artery/i,valve:/cusp of aortic valve/i}))ids[key]=sources.filter(s=>pattern.test(s.sourceName||'')).map(s=>s.fileId);
const reverse=Object.fromEntries(Object.entries(ids).flatMap(([k,v])=>v.map(id=>[id,k]))),parts={};
const bytes=fs.readFileSync('public/models/rxatlas-anatomy.glb');const gltf=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');gltf.scene.updateMatrixWorld(true);
gltf.scene.traverse(o=>{if(!o.isMesh)return;const g=worldGeometry(o),pos=g.getAttribute('position'),norm=g.getAttribute('normal'),source=o.geometry.getAttribute('_source_part'),ix=g.index;for(let i=0;i<ix.count;i+=3){const indices=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)],sid=Math.round(source.getX(indices[0])),meta=sources[sid],key=reverse[meta.fileId];if(!key||indices.some(j=>Math.round(source.getX(j))!==sid))continue;const p=parts[key]??={positions:[],normals:[],sourceIds:ids[key],sourceNames:ids[key].map(id=>sources.find(s=>s.fileId===id)?.sourceName)};for(const j of indices){p.positions.push(pos.getX(j),pos.getY(j),pos.getZ(j));p.normals.push(norm.getX(j),norm.getY(j),norm.getZ(j))}}g.dispose()});
for(const k of Object.keys(ids))if(ids[k].length&&!parts[k])throw Error('Missing real anatomy: '+k);
fs.writeFileSync('scripts/deep-dive/extracted-parts.json',JSON.stringify(parts));
const doc=new Document(),buf=doc.createBuffer(),scene=doc.createScene('BodyParts3D registered aorta and branches');const material=doc.createMaterial('artery').setBaseColorFactor([.46,.059,.051,1]).setRoughnessFactor(.7);
for(const [k,p] of Object.entries(parts)){const attr=(a)=>doc.createAccessor().setType('VEC3').setArray(new Float32Array(a)).setBuffer(buf);const primitive=doc.createPrimitive().setAttribute('POSITION',attr(p.positions)).setAttribute('NORMAL',attr(p.normals)).setMaterial(material);scene.addChild(doc.createNode(k).setMesh(doc.createMesh(k).addPrimitive(primitive)).setExtras({sourceIds:p.sourceIds}));}
await doc.transform(meshopt({encoder:MeshoptEncoder}));const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});await io.write('public/models/deep-dive/aorta.glb',doc);
console.log(Object.fromEntries(Object.entries(parts).map(([k,p])=>[k,{triangles:p.positions.length/9,sourceIds:p.sourceIds}])));
