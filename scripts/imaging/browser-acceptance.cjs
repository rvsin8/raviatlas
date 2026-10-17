/* Run against an already running local production export. Never starts a server. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
if(process.env.SITES_MANAGED_LINUX_CONTAINER==='1'){
 console.error('Browser QA requires the supported control-browser skill in managed Sites. This standalone harness is for your local browser environment. No browser was launched.');process.exit(2);
}
const base=process.env.RXATLAS_TEST_URL,executablePath=process.env.CHROME_PATH;
if(!base||!executablePath){console.error('Set RXATLAS_TEST_URL to your running local site and CHROME_PATH to a Chromium/Chrome executable.');process.exit(2)}
const {chromium}=require('playwright-core'),sharp=require('sharp');
const out=path.resolve(process.env.RXATLAS_QA_OUTPUT||'docs/organs/browser-evidence');fs.mkdirSync(out,{recursive:true});
const report={pass:false,startedAt:new Date().toISOString(),environment:'Chromium software WebGL; mobile is emulation, not a physical phone',scenarios:[],errors:[]};
async function pixels(buffer){return sharp(buffer).resize(320,240,{fit:'fill'}).removeAlpha().raw().toBuffer()}
async function pixelDelta(a,b){const [x,y]=await Promise.all([pixels(a),pixels(b)]);let count=0;for(let i=0;i<x.length;i+=3)if(Math.max(Math.abs(x[i]-y[i]),Math.abs(x[i+1]-y[i+1]),Math.abs(x[i+2]-y[i+2]))>8)count++;return count/(x.length/3)}
async function range(locator,value){await locator.evaluate((el,v)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,String(v));el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))},value)}
(async()=>{const browser=await chromium.launch({executablePath,headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 for(const mobile of [false,true])for(const theme of ['light','dark']){
  const name=(mobile?'mobile':'desktop')+'-'+theme,context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,reducedMotion:'reduce'}),page=await context.newPage();page.setDefaultTimeout(30000);
  const scenario={name,checks:[],metrics:{},consoleErrors:[]};report.scenarios.push(scenario);
  page.on('pageerror',e=>scenario.consoleErrors.push(e.message));page.on('console',m=>{if(m.type()==='error')scenario.consoleErrors.push(m.text())});
  const start=performance.now();await page.goto(new URL(`/explore/?body=${mobile?'female':'male'}&mode=disorder&skin=1&theme=${theme}&organ=brain&organTab=imaging`,base).href);
  const canvas=page.locator('.imaging-canvas canvas');await page.waitForFunction(()=>document.querySelector('.imaging-canvas canvas')?.dataset.ready==='1',null,{timeout:120000});scenario.metrics.firstImagingReadyMs=performance.now()-start;
  assert(await canvas.evaluate(c=>!!c.getContext('webgl2')),'WebGL 2 unavailable');
  await page.screenshot({path:path.join(out,name+'-workspace.png')});
  async function check(label,action,{target=canvas,url=true,threshold=.00005}={}){
   await target.scrollIntoViewIfNeeded();const before=await target.screenshot(),beforeURL=page.url();await action();await page.waitForTimeout(450);await target.scrollIntoViewIfNeeded();const after=await target.screenshot(),delta=await pixelDelta(before,after),changed=page.url()!==beforeURL;
   const result={label,pixelFraction:delta,urlChanged:changed,pass:delta>threshold&&(!url||changed)};scenario.checks.push(result);assert(result.pass,`${name}: ${label} did not change the expected image/state`);
  }
  for(const c of [{id:1,name:'edema'},{id:2,name:'non-enhancing tumor'},{id:3,name:'enhancing tumor'}]){
   await check('Finding '+c.name,()=>page.locator('.imaging-class button').filter({hasText:new RegExp('^'+c.name)}).first().click());
   assert.equal(await canvas.getAttribute('data-finding'),String(c.id));
  }
  await check('Explain finding',()=>page.getByRole('button',{name:'Explain this finding →',exact:true}).click());
  for(const step of ['Compare','Measure','Context','Limits'])await check('Guide '+step,()=>page.getByRole('navigation',{name:'Finding explanation steps'}).getByRole('button',{name:step,exact:true}).click(),{target:step==='Compare'?page.locator('.mri-slice canvas').first():canvas});
  const shared=page.url();await page.reload();await page.waitForFunction(()=>document.querySelector('.imaging-canvas canvas')?.dataset.ready==='1');assert.equal(page.url(),shared);assert.match(await page.locator('.imaging-guide-caption').innerText(),/cannot tell us/);
  await page.getByRole('button',{name:'Previous explanation step',exact:true}).click();assert.equal(new URL(page.url()).searchParams.get('guide'),'3');await page.getByRole('button',{name:'Next explanation step',exact:true}).click();assert.equal(new URL(page.url()).searchParams.get('guide'),'4');await page.getByRole('button',{name:'Explore freely',exact:true}).click();
  await check('Overlay opacity',()=>range(page.getByLabel('Overlay opacity'),.7));
  for(const plane of ['axial','coronal','sagittal']){
   const slice=page.locator(`.mri-slice[aria-label="${plane} MRI"] canvas`),slider=page.getByRole('slider',{name:plane+' slice',exact:true});
   await check(plane+' slider',async()=>range(slider,Number(await slider.inputValue())+3),{target:slice});
   await check(plane+' keyboard crosshair',()=>slice.press('PageDown'),{target:slice});
   await check(plane+' zoom',()=>page.getByRole('button',{name:'Zoom in '+plane,exact:true}).click(),{target:page.locator(`.mri-slice[aria-label="${plane} MRI"] .mri-image-viewport`),url:false});
  }
  const axial=page.locator('.mri-slice[aria-label="axial MRI"]'),viewport=axial.locator('.mri-image-viewport');await axial.getByRole('button',{name:'Pan',exact:true}).click();
  await check('Slice pan',async()=>{const b=await viewport.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2+24,b.y+b.height/2+16,{steps:8});await page.mouse.up()},{target:viewport,url:false});await axial.getByRole('button',{name:'Pan active',exact:true}).click();
  const fullscreen=page.getByRole('button',{name:'Enter fullscreen',exact:true});if(await fullscreen.isEnabled()){await fullscreen.click();await page.getByRole('button',{name:'Exit fullscreen',exact:true}).click()}
  await check('FLAIR sequence',()=>page.getByLabel('Sequence',{exact:true}).selectOption('1'),{target:page.locator('.mri-slice canvas').first()});
  await check('Display window',()=>range(page.getByLabel('Window',{exact:true}),12000),{target:page.locator('.mri-slice canvas').first(),url:false});
  await check('Display level',()=>range(page.getByLabel('Level',{exact:true}),12000),{target:page.locator('.mri-slice canvas').first(),url:false});
  for(const label of ['Brain context','Linked planes'])await check(label,()=>page.getByLabel(label,{exact:true}).uncheck());
  await check('Class visibility',()=>page.getByRole('checkbox',{name:'Show edema',exact:true}).uncheck());
  await check('Compare raw / overlay',()=>page.getByLabel('Compare raw / overlay',{exact:true}).check(),{target:page.locator('.mri-slice canvas').first()});
  await check('Focus finding',()=>page.getByRole('button',{name:'Focus finding',exact:true}).click());
  await check('Whole brain framing',()=>page.getByRole('button',{name:'Whole brain',exact:true}).click());
  await page.getByRole('button',{name:'Follow crosshairs',exact:true}).click();assert(new URL(page.url()).searchParams.get('frame')==='cursor');
  await check('Reset views',()=>page.getByRole('button',{name:'Reset views',exact:true}).click());
  await page.getByRole('button',{name:'2D only',exact:true}).click();assert.equal(await canvas.count(),0);assert.equal(await page.locator('.mri-slice canvas').count(),3);await page.getByRole('button',{name:'Enable 3D',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.imaging-canvas canvas')?.dataset.ready==='1');
  // Actual context loss, then recover without losing the decoded MRI or URL.
  await canvas.evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await page.getByRole('button',{name:'Restore 3D',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.imaging-canvas canvas')?.dataset.ready==='1');
  const tumor=page.locator('.imaging-disease-card').filter({hasText:'Brain tumors'});await tumor.getByRole('button',{name:'Treatment context →',exact:true}).click();assert(new URL(page.url()).searchParams.get('organTab')==='treatments');await page.getByRole('button',{name:'Open glioma MRI example →',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.imaging-canvas canvas')?.dataset.ready==='1');
  assert.equal(await page.getByRole('button',{name:'Imaging unavailable',exact:true}).count(),3);
  await page.screenshot({path:path.join(out,name+'-findings.png')});
  if(mobile){for(const item of ['MRI slices','3D model','Findings'])await page.getByRole('navigation',{name:'Imaging workspace sections'}).getByRole('button',{name:item,exact:true}).click()}
  await canvas.scrollIntoViewIfNeeded();await page.waitForTimeout(2000);const idleBefore=Number(await canvas.getAttribute('data-frames'));await page.waitForTimeout(1000);scenario.metrics.idleFramesInOneSecond=Number(await canvas.getAttribute('data-frames'))-idleBefore;assert(scenario.metrics.idleFramesInOneSecond<=2,'Demand canvas did not idle');
  const bounds=await canvas.boundingBox(),f0=Number(await canvas.getAttribute('data-frames')),t0=performance.now();await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();for(let i=0;i<60;i++){await page.mouse.move(bounds.x+bounds.width/2+Math.sin(i/8)*80,bounds.y+bounds.height/2+Math.cos(i/8)*40);await page.waitForTimeout(16)}await page.mouse.up();scenario.metrics.interactionRenderedFramesPerSecond=(Number(await canvas.getAttribute('data-frames'))-f0)/((performance.now()-t0)/1000);scenario.metrics.note='Measured during scripted orbit, not a maximum GPU throughput benchmark.';
  await page.getByRole('button',{name:'Brain anatomy',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);assert.equal(new URL(page.url()).searchParams.get('body'),mobile?'female':'male');assert.equal(new URL(page.url()).searchParams.get('mode'),'disorder');
  assert.equal(scenario.consoleErrors.length,0,scenario.consoleErrors.join('\n'));await context.close();
 }
 report.pass=true;
 }catch(e){report.errors.push(String(e));throw e}finally{fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
