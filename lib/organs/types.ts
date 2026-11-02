import type {OrganId} from './state';
export type Bounds={min:number[];max:number[]};
export type Structure={id:string;name:string;description:string;layer:string;available:boolean;bounds?:Bounds;sourceIds:string[];fmaIds:string[];sources:string[];_review:string};
export type OrganCondition={id:string;name:string;anatomy:string[];summary:string;symptoms:string[];treatment:string;catalogRefs:string[];drugRefs:string[];sources:string[];_review:string};
export type ExhibitStep={title:string;text:string;structure:string|null;view:string;sources:string[]};
export type OrganDefinition={id:OrganId;name:string;classification:string;asset:string;assetVersion:string;referenceNote:string;structures:Structure[];layers:string[];bounds:Bounds;availableAnimations:string[];disabledCapabilities:{name:string;reason:string}[];conditions:OrganCondition[];sources:string[];attribution:{text:string;url:string};metrics:{bytes:number;triangles:number};exhibit?:ExhibitStep[]};
