export type BodySex = 'female' | 'male';
export type Sex = BodySex | 'both';
export type SourcedPoint = {summary:string;sources:string[];_review?:string};
export type Mode = 'disease' | 'disorder' | 'injury';
export type Vec3 = [number,number,number];
export type Region = { id:string; name:string; parentId:string|null; cameraPosition:Vec3; cameraTarget:Vec3; meshIds:string[]; position:Vec3;sex?:Sex;sources?:string[] };
export type Condition = {id:string;name:string;mode:Mode;regionIds:string[];summary:string;commonSymptoms:string[];drugIds:string[];nonDrugTreatments:string[];_review?:string;source?:string;anatomyContext?:"female";sex:Sex;sources:string[];sex_differences?:SourcedPoint[]};
export type Drug = {id:string;generic:string;brands:string[];drugClass:string;mechanism:string;rxStatus:'OTC'|'Rx'|'Both';_review?:string;source?:string;pregnancy_lactation?:{pregnancy:string;lactation:string;label:string;sources:string[];sections:string[];_review?:string}};
