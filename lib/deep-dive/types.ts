export type SegmentId='root'|'ascending'|'arch'|'descending'|'abdominal';
export type V3=[number,number,number];
export type AortaData={points:V3[];radii:number[];segments:{id:SegmentId;start:number;end:number}[];branches:{id:string;name:string;fma:string;target:string;origin:number;points:V3[];sourceIds:string[]}[];flowExtensions:Record<string,V3[]>;sourceIds:Record<string,string[]>;bounds:V3[]};
export type DiveState={segment:SegmentId|null;entry:number|null;extent:number;slice:number;cross:boolean;playing:boolean;dissection:boolean;depth:'basics'|'detailed'|'clinical';theme:'light'|'dark';rate:number;pressure:number;load:number;sound:boolean;speed:number;step:number;sheet:boolean;tamponade:boolean;regurgitation:boolean;coronary:boolean;tool:'inspect'|'tear'|'rupture';journey:boolean};
