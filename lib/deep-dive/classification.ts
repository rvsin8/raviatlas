export type Bounds={archStart:number;archEnd:number;diaphragm:number};
export type Classification={stanford:'A'|'B'|'None';debakey:'I'|'II'|'IIIa'|'IIIb'|'Unclassified'|'None';archPattern:boolean;meaning:string;debakeyMeaning:string};
/** Describes involvement, independently of entry-based SVS/STS terminology.
 * Phase 1 propagation is distal only. Optional proximal permits explicit regression tests.
 */
export function classify(entry:number|null,extent:number,b:Bounds,proximal=entry):Classification{
 if(entry===null)return{stanford:'None',debakey:'None',archPattern:false,meaning:'No dissection is active.',debakeyMeaning:'Choose an example or place an entry tear.'};
 if(!Number.isFinite(entry)||!Number.isFinite(extent)||entry<0||extent>1||extent<entry||proximal===null||proximal>entry||proximal<0)throw new RangeError('Invalid dissection interval');
 const ascending=proximal<b.archStart,arch=proximal<b.archEnd&&extent>=b.archStart;
 let debakey:Classification['debakey']='Unclassified';
 if(entry<b.archStart)debakey=extent>=b.archStart?'I':'II';
 else if(entry>=b.archEnd&&entry<b.diaphragm&&proximal>=b.archEnd)debakey=extent>b.diaphragm?'IIIb':'IIIa';
 const meanings={I:'Begins in the ascending aorta and reaches the arch or beyond.',II:'Begins and remains within the ascending aorta.',IIIa:'Begins beyond the left subclavian artery and stays above the diaphragm.',IIIb:'Begins beyond the left subclavian artery and extends below the diaphragm.',Unclassified:'This pattern does not fit a classic DeBakey category.'};
 return {stanford:ascending?'A':'B',debakey,archPattern:arch&&!ascending,meaning:ascending?'The ascending aorta is involved.':'The ascending aorta is not involved.',debakeyMeaning:meanings[debakey]};
}
export function branchReached(origin:number,entry:number|null,extent:number){return entry!==null&&origin>=entry&&origin<=extent}
