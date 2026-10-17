import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {prune} from '@gltf-transform/functions';
import {MeshoptDecoder,MeshoptEncoder} from 'meshoptimizer';
await MeshoptDecoder.ready;await MeshoptEncoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder,'meshopt.encoder':MeshoptEncoder});const d=await io.read('public/models/body.glb');console.log(d.getRoot().listNodes().filter(n=>n.getName()==='heart').map(n=>({name:n.getName(),children:n.listChildren().length,extras:n.getExtras()})));
let keep=new Set();for(const n of d.getRoot().listNodes())if(n.getName()==='heart'||n.getExtras().regionId==='heart')n.traverse(x=>keep.add(x));
for(const n of [...keep]){let parent=n.getParentNode();while(parent){keep.add(parent);parent=parent.getParentNode()}}
for(const n of [...d.getRoot().listNodes()])if(!keep.has(n))n.dispose();await d.transform(prune());await io.write('public/models/heart.glb',d);console.log('Exported original heart geometry',keep.size);
