import{NodeIO}from'@gltf-transform/core';import{getBounds}from'@gltf-transform/functions';
const d=await new NodeIO().read('.model-build/female/source.glb');console.log('body',getBounds(d.getRoot().listScenes()[0]));for(const n of d.getRoot().listNodes())if(['VH_F_skin','VH_F_heart','VH_F_mammary_gland','VH_F_uterus','VH_F_knee_R','VH_F_lungs','VH_F_left_ovary'].includes(n.getName()))console.log(n.getName(),getBounds(n));
console.log('triangles',d.getRoot().listMeshes().reduce((a,m)=>a+m.listPrimitives().reduce((b,p)=>b+(p.getIndices()?.getCount()||0)/3,0),0));
