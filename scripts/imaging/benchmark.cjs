// Host CPU pipeline timings only. This is not a browser or GPU benchmark.
const fs=require('node:fs'),zlib=require('node:zlib'),os=require('node:os'),{performance}=require('node:perf_hooks'),{load}=require('./load-ts.cjs');
const {slicePixels,planeAxes,planes}=load('lib/organs/imaging.ts'),m=require('../../data/imaging/case.json');
const mask=new Uint8Array(zlib.gunzipSync(fs.readFileSync('public'+m.maskUrl))),q=zlib.gunzipSync(fs.readFileSync('public'+m.sequences[0].url)),signal=new Uint16Array(q.buffer,q.byteOffset,q.byteLength/2),colors=[[0,0,0],[100,150,180],[130,120,200],[240,160,40]];
const quantile=(a,p)=>a.slice().sort((a,b)=>a-b)[Math.min(a.length-1,Math.floor(a.length*p))];
const report={scope:'Host CPU: slice-pixel generation only; excludes browser, GPU, network and React',node:process.version,architecture:os.arch(),cpu:os.cpus()[0]?.model,iterations:40,planes:{},decodedCacheBytes:mask.byteLength+signal.byteLength*m.sequences.length,browserDesktopFPS:null,browserMobileFPS:null};
for(const plane of planes){const a=planeAxes[plane],times=[];for(let i=0;i<45;i++){const t=performance.now();slicePixels(plane,m.classes[2].focusVoxel[a.s]+i%3,m.dimensions,signal,mask,m.sequences[0].window,m.sequences[0].level,.55,[1,2,3],colors);if(i>=5)times.push(performance.now()-t)}report.planes[plane]={medianMs:Number(quantile(times,.5).toFixed(3)),p95Ms:Number(quantile(times,.95).toFixed(3))}}
fs.writeFileSync('docs/organs/host-pipeline-benchmark.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
