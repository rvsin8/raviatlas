import fs from 'node:fs';
import assert from 'node:assert/strict';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {MeshoptDecoder} from 'meshoptimizer';
await MeshoptDecoder.ready;
const doc=await new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder}).read('public/models/rxatlas-anatomy.glb');
const regions=JSON.parse(fs.readFileSync('data/regions.json')).regions;
const names=new Set(doc.getRoot().listNodes().filter(n=>n.getMesh()).map(n=>n.getName()));
for(const id of ['heart','knee','larynx','skin'])assert(names.has(id),`Missing ${id}`);
let triangles=0;
for(const m of doc.getRoot().listMeshes())for(const p of m.listPrimitives()){
 const pos=p.getAttribute('POSITION');assert(pos.getCount()>0);assert([...pos.getArray()].every(Number.isFinite));
 const ix=p.getIndices();assert([...ix.getArray()].every(i=>i<pos.getCount()));triangles+=ix.getCount()/3;
 const mat=p.getMaterial();assert(mat.getRoughnessFactor()>=.7);assert.equal(mat.getAlphaMode(),mat.getName()==='skin'?'BLEND':'OPAQUE');
}
for(const r of regions){for(const id of r.meshIds)assert(names.has(id));assert(r.cameraPosition.every(Number.isFinite));}
const total=fs.statSync('public/models/rxatlas-anatomy.glb').size+fs.statSync('public/environments/studio_small_03_1k.hdr').size;assert(total<15000000);
console.log(JSON.stringify({decoded:true,regionNodes:names.size,triangles,modelAndHDRBytes:total}));
