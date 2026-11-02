// Browser acceptance is explicit and separate from reproducible static builds.
// Managed Sites QA must use its supported preview and browser control surface.
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'){
 console.error('Browser acceptance not run: use the supported Sites preview/browser. Run this legacy suite on a local graphics-capable machine.');
 process.exit(1);
}
const {spawnSync}=require('node:child_process');
for(const script of ['verify:deep-dive','verify:mode-heatmap','verify:clinical']){
 const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run',script],{stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.status!==0)process.exit(result.status??1);
}
