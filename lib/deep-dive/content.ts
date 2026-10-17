export const sources={acc:'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106',sts:'https://www.sts.org/sites/default/files/documents/STS-SVS-ReportingStandardsTypeBAorticDissections.pdf'};
export const basics={_review:'pending',sources:[sources.acc,sources.sts],segments:[
{id:'root',name:'Aortic root',text:'The aorta begins at the heart’s outlet. The aortic valve sits here, and the coronary arteries supply the heart itself.'},
{id:'ascending',name:'Ascending aorta',text:'This first stretch carries blood upward from the heart. A dissection involving this stretch is Stanford type A.'},
{id:'arch',name:'Aortic arch',text:'The aorta curves toward the back. Three main branches supply the head, neck, and arms.'},
{id:'descending',name:'Descending thoracic aorta',text:'Blood travels downward through the chest. The left subclavian branch marks the nearby transition from the arch.'},
{id:'abdominal',name:'Abdominal aorta',text:'Below the diaphragm, branches supply the gut and kidneys. The aorta then divides toward the two legs.'}
].map(x=>({...x,_review:'pending' as const})),steps:[
'Normal flow: the heart sends blood through one open channel and into its branches.',
'An entry tear lets blood move between layers of the aortic wall.',
'The separated inner wall becomes a flap. The original channel is the true lumen; the new channel is the false lumen.',
'The false lumen can expand and press on the true lumen. A reached branch is not necessarily blocked.',
'This example illustrates possible loss of organ blood flow. Actual perfusion depends on the individual anatomy and pressure.'
].map(text=>({text,_review:'pending' as const})),pressure:{_review:'pending',text:'Slower heartbeats and lower pressure can reduce the force acting on the damaged wall. These controls illustrate that idea; they are not treatment targets.'},layers:[{name:'Intima',text:'Thin inner lining.'},{name:'Media',text:'Middle supporting layer, where the wall separates.'},{name:'Adventitia',text:'Outer supporting layer.'}].map(x=>({...x,_review:'pending' as const})),complications:[{id:'tamponade',name:'Tamponade',text:'Blood leaking into the space around the heart can compress it.'},{id:'regurgitation',name:'Aortic regurgitation',text:'A damaged valve may let blood leak backward into the heart.'},{id:'coronary',name:'Coronary involvement',text:'A tear reaching a coronary opening may reduce the heart’s own blood supply.'}].map(x=>({...x,_review:'pending' as const}))};
