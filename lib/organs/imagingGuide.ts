import manifest from '@/data/imaging/case.json';
import type {ImagingState} from './imagingState';
/** Every guide step is one atomic scene-state change; text and illustrations agree. */
export function guideState(step:number,finding:number):Partial<ImagingState>{
 if(!Number.isInteger(step)||step<0||step>4)throw new Error('Unknown imaging guide step');
 const region=manifest.classes.find(c=>c.id===finding);if(!region)throw new Error('Unknown annotation class');
 return {imageGuideStep:step,imageFinding:finding,imageVoxel:region.focusVoxel as [number,number,number],imageSequence:finding===1?1:0,imageClasses:step===2?[finding]:[1,2,3],imageOpacity:step===4?0:step===2?.85:.55,imageCompare:step===1,imagePlanes:step!==2,imageContext:step!==2,imageCamera:step<3?'finding':'context'};
}
