import type {OrganState} from './state';
export const journeySteps=['Anatomy','MRI slices','The finding','Treatment concepts','Check understanding'] as const;
/** Only explicit lesson navigation changes the workspace. MRI preferences stay intact. */
export function journeyPatch(step:number):Partial<OrganState>{
 if(!Number.isInteger(step)||step<0||step>=journeySteps.length)throw new Error('Unknown learning step');
 return {organ:'brain',organJourney:step,organCondition:'brain-tumor',organTab:step===0?'anatomy':step===3?'treatments':'imaging',organAnimation:'off',organStep:-1,organStructure:null,organIsolate:false,organLayer:'all'};
}
export const journeyQuestions=[
 {prompt:'Where do the colored regions in this MRI example come from?',options:['Reference annotations supplied with the dataset','A new AI diagnosis made by RxAtlas','A map of every tumor cell'],answer:0,explanation:'These are the supplied dataset labels. RxAtlas does not run a diagnostic or segmentation model.'},
 {prompt:'Can the reference anatomy model identify the exact lobe affected in this scan?',options:['Yes, they are the same person','No. The reference model is separate and this case has no lobe atlas','Yes, the overlay color identifies the lobe'],answer:1,explanation:'The reference brain is not registered to this scan. No automatic lobe localization is claimed.'},
 {prompt:'What can this teaching MRI decide about treatment?',options:['The correct drug and dose','Whether surgery is safe for this person','Neither; clinical evaluation and tumor characterization are needed'],answer:2,explanation:'Treatment is individualized. A colored annotation alone cannot select a treatment.'}
] as const;
