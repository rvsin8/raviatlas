/** Qualitative teaching animation, never a physiological or risk model. */
export const pulseStops=['Very low','Low','Normal','High','Very high'] as const;
export const pulseStop=(load:number)=>pulseStops[Math.round(Math.max(0,Math.min(1,load))*4)];
export function pulseSettings(load:number){const x=Math.max(0,Math.min(1,load));return {frequency:.45+1.75*x,amplitude:.0004+.006*x*x,flutter:.00012+.006*x*x,flow:.015+.17*x*x,density:60+Math.round(160*x),growth:x<=.375?0:x<.625?.001*(x-.375)/.25:.012+.028*(x-.625)/.375,risk:x,force:x};}
export function beat(phase:number){return Math.pow(Math.max(0,Math.sin(phase*Math.PI*2)),8)}
export function pulseCaption(load:number){return [
'A slow, gentle pulse reduces the force on the tear. Growth is paused in this teaching illustration.',
'Lowering heart rate and blood pressure reduces the force on the tear. This is why treatment starts here.',
'Each heartbeat sends a pressure wave down the aorta. The tear creeps in this illustrative sequence.',
'Stronger, faster pulses stretch the wall and push the tear forward with each beat.',
'Each strong beat pushes blood into the false lumen and can extend the tear.'
][Math.round(load*4)]}
