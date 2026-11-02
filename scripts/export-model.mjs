import fs from 'node:fs';
import crypto from 'node:crypto';
import {Document,NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {weld,simplify,dedup,prune,meshopt,textureCompress,joinPrimitives} from '@gltf-transform/functions';
import {MeshoptEncoder,MeshoptDecoder,MeshoptSimplifier} from 'meshoptimizer';
import {BufferGeometry,Float32BufferAttribute} from 'three';
import sharp from 'sharp';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
const groups=JSON.parse(fs.readFileSync('.model-build/groups.json')),report=JSON.parse(fs.readFileSync('data/model-reports/build-report.json')),bounds=JSON.parse(fs.readFileSync('data/model-bounds.json')),regions=JSON.parse(fs.readFileSync('data/regions.json'));
const reg=Object.fromEntries(regions.regions.map(r=>[r.id,r]));reg['pectoral-surface']={parentId:'chest'};reg.unmapped={parentId:null};
const theme=fs.readFileSync(new URL('../app/theme.css',import.meta.url),'utf8');
const palette=Object.fromEntries([...theme.matchAll(/--anatomy-([\w-]+):\s*(#[\da-fA-F]+)/g)].map(m=>[m[1],m[2]]));
const doc=new Document(),buffer=doc.createBuffer(),scene=doc.createScene('RxAtlas BodyParts3D');doc.getRoot().setDefaultScene(scene);doc.getRoot().getAsset().copyright='BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International; adapted for RxAtlas';
const nodes={},materials=new Map();
for(const g of groups){const {regionId:rid,tissue}=g;const bytes=fs.readFileSync(g.positionFile),ib=fs.readFileSync(g.indexFile),pos=new Float32Array(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)),indices=new Uint32Array(ib.buffer.slice(ib.byteOffset,ib.byteOffset+ib.byteLength));let geom=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(pos,3));geom.setIndex(Array.from(indices));geom=mergeVertices(geom,1e-5);geom.computeVertexNormals();
 if(!nodes[rid]){nodes[rid]=doc.createNode(rid).setMesh(doc.createMesh(rid)).setExtras({regionId:rid,parentId:reg[rid].parentId});scene.addChild(nodes[rid]);}
 const color=palette[tissue==='organ'?rid:tissue]||palette[tissue]||palette.organ,key=tissue+color;
 if(!materials.has(key)){const rgb=color.slice(1).match(/../g).map(x=>{const c=parseInt(x,16)/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});const mat=doc.createMaterial(tissue).setBaseColorFactor([...rgb,tissue==='skin'?.22:1]).setRoughnessFactor(.8).setMetallicFactor(0).setExtras({tissue});if(tissue==='skin')mat.setAlphaMode('BLEND');materials.set(key,mat);}
 const attr=(type,array)=>doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);
 nodes[rid].getMesh().addPrimitive(doc.createPrimitive().setAttribute('POSITION',attr('VEC3',new Float32Array(geom.getAttribute('position').array))).setAttribute('NORMAL',attr('VEC3',new Float32Array(geom.getAttribute('normal').array))).setIndices(attr('SCALAR',new Uint32Array(geom.index.array))).setMaterial(materials.get(key)).setExtras({regionId:rid,tissue,fileId:g.fileId}));geom.dispose();}
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready,MeshoptSimplifier.ready]);
await doc.transform(weld(),simplify({simplifier:MeshoptSimplifier,ratio:.1,error:.001,lockBorder:true}));
// Smooth normals must follow simplification, before compression/quantization.
for(const m of doc.getRoot().listMeshes())for(const p of m.listPrimitives()){let g=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(p.getAttribute('POSITION').getArray(),3));g.setIndex(Array.from(p.getIndices().getArray()));g=mergeVertices(g,1e-5);g.computeVertexNormals();const attr=(type,array)=>doc.createAccessor().setType(type).setArray(array).setBuffer(buffer);p.setAttribute('POSITION',attr('VEC3',new Float32Array(g.getAttribute('position').array)));p.setIndices(attr('SCALAR',new Uint32Array(g.index.array)));p.setAttribute('NORMAL',attr('VEC3',new Float32Array(g.getAttribute('normal').array)));g.dispose();}
// Preserve source identity through merging/compression so the final GLB remains auditable per part.
const sourceIndex=Object.fromEntries(JSON.parse(fs.readFileSync('data/model-reports/source-part-bounds.json')).map((p,i)=>[p.fileId,i]));
for(const m of doc.getRoot().listMeshes()){
 const sets=new Map();
 for(const p of m.listPrimitives()){
  const id=sourceIndex[p.getExtras().fileId];
  p.setAttribute('_SOURCE_PART',doc.createAccessor().setType('SCALAR').setArray(new Uint16Array(p.getAttribute('POSITION').getCount()).fill(id)).setBuffer(buffer));
  const mat=p.getMaterial();if(!sets.has(mat))sets.set(mat,[]);sets.get(mat).push(p);
 }
 for(const ps of sets.values())if(ps.length>1){const joined=joinPrimitives(ps);for(const p of ps){m.removePrimitive(p);p.dispose();}m.addPrimitive(joined);}
}
await doc.transform(dedup(),prune({keepLeaves:true}),textureCompress({encoder:sharp,targetFormat:'webp',resize:[1024,1024]}),meshopt({encoder:MeshoptEncoder,level:'high',quantizePosition:14,quantizeGeneric:16}));
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});await io.write('public/models/rxatlas-anatomy.glb',doc);
const bytes=fs.statSync('public/models/rxatlas-anatomy.glb').size,triangles=doc.getRoot().listMeshes().reduce((s,m)=>s+m.listPrimitives().reduce((n,p)=>n+p.getIndices().getCount()/3,0),0);
for(const r of regions.regions){r.meshIds=r.id==='breast'?['pectoral-surface']:Object.keys(nodes).filter(id=>id===r.id||reg[id].parentId===r.id);const b=bounds[r.id]||bounds[r.parentId];if(!b)continue;const c=b.min.map((v,j)=>(v+b.max[j])/2),size=b.max.map((v,j)=>v-b.min[j]),back=r.id==='back'||r.parentId==='back'||r.id==='cervical-spine',dist=Math.max(.6,Math.max(size[0],size[1])*1.65,size[2]*2.3);r.position=c;r.cameraTarget=c;r.cameraPosition=[c[0],c[1]+dist*.035,c[2]+(back?-dist:dist)];}
fs.writeFileSync('data/regions.json',JSON.stringify(regions,null,2)+'\n');
report.metrics={bytes,megabytes:bytes/1e6,triangles,originalTriangles:report.kept.reduce((s,p)=>s+p.triangles,0),keptParts:report.kept.length,excludedParts:report.excluded.length,unmappedParts:report.unmapped.length,regionNodes:Object.keys(nodes).length,textures:doc.getRoot().listTextures().length,textureCompression:'WebP optimization stage executed; source OBJ meshes contain no texture images.'};
fs.writeFileSync('data/model-reports/build-report.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync('public/models/model-manifest.json',JSON.stringify({...report.metrics,source:report.source,license:report.license,missingRegions:report.missingRegionGeometry,sha256:crypto.createHash('sha256').update(fs.readFileSync('public/models/rxatlas-anatomy.glb')).digest('hex')},null,2)+'\n');console.log(JSON.stringify(report.metrics,null,2));
