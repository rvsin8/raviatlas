export type Region={id:string;name:string;subregions:string[];description:string}
export const regions:Region[]=[
{id:'head',name:'Head',subregions:['Brain','Eye','Ear'],description:'Neurologic and sensory anatomy.'},
{id:'neck',name:'Neck',subregions:['Thyroid','Pharynx'],description:'Upper airway, endocrine and supporting structures.'},
{id:'chest',name:'Chest',subregions:['Heart','Lung','Breast'],description:'Cardiopulmonary anatomy and anterior chest wall.'},
{id:'abdomen',name:'Abdomen',subregions:['Liver','Stomach','Kidney'],description:'Digestive and retroperitoneal organs.'},
{id:'pelvis',name:'Pelvis',subregions:['Bladder','Reproductive organs'],description:'Pelvic viscera and supporting structures.'},
{id:'back',name:'Back',subregions:['Spine','Paraspinal muscles'],description:'Posterior trunk and axial support.'},
{id:'arm',name:'Arm',subregions:['Shoulder','Upper arm','Forearm'],description:'Upper-limb structures proximal to the hand.'},
{id:'hand',name:'Hand',subregions:['Wrist','Palm','Digits'],description:'Distal upper-limb structures.'},
{id:'leg',name:'Leg',subregions:['Hip','Thigh','Knee','Lower leg'],description:'Lower-limb structures proximal to the foot.'},
{id:'foot',name:'Foot',subregions:['Ankle','Midfoot','Toes'],description:'Distal lower-limb structures.'}
]
export const entries=[
{name:'Asthma',kind:'Disease',region:'chest',text:'Chronic inflammatory airway disease with variable airflow obstruction.'},
{name:'Albuterol',kind:'Drug',region:'chest',text:'Short-acting beta2 agonist bronchodilator used for rapid relief of bronchospasm.'},
{name:'Levothyroxine',kind:'Drug',region:'neck',text:'Synthetic thyroxine used to replace deficient thyroid hormone.'},
{name:'Migraine',kind:'Disorder',region:'head',text:'Recurrent neurologic disorder that can include severe headache and sensory symptoms.'},
{name:'Lisinopril',kind:'Drug',region:'systemic',text:'ACE inhibitor used in hypertension and selected cardiac or kidney indications.'},
{name:'Metformin',kind:'Drug',region:'systemic',text:'Common glucose-lowering medication used in type 2 diabetes.'}
]