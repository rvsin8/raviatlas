/** Resolve shared visual tokens for WebGL and generated SVG. */
export function themeToken(name:string){return typeof document==='undefined'?'':getComputedStyle(document.documentElement).getPropertyValue(name).trim()}
