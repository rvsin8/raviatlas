// Illustrative order, not measured transit time or a measured cardiac cycle.
export const circulation=[
 {ids:['svc','ivc'],text:'Body → venae cavae → right atrium',oxygenated:false},
 {ids:['right-atrium','tricuspid','right-ventricle'],text:'Right atrium → tricuspid valve → right ventricle',oxygenated:false},
 {ids:['right-ventricle','pulmonary','pulmonary-arteries'],text:'Right ventricle → pulmonary valve → pulmonary arteries → lungs',oxygenated:false},
 {ids:['pulmonary-veins','left-atrium'],text:'Lungs → pulmonary veins → left atrium',oxygenated:true},
 {ids:['left-atrium','mitral','left-ventricle'],text:'Left atrium → mitral valve → left ventricle',oxygenated:true},
 {ids:['left-ventricle','aortic','aorta'],text:'Left ventricle → aortic valve → aorta → body',oxygenated:true}
];
export function cycleContraction(seconds:number){const phase=(seconds%1.2)/1.2;return phase<.38?Math.sin(phase/.38*Math.PI):0;}
export function flowStage(seconds:number){return Math.floor(seconds/1.8)%circulation.length;}
