const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript'),Module=require('module');
const m=new Module('clinical-state',module);m.paths=module.paths;m._compile(ts.transpileModule(fs.readFileSync('lib/clinical-deep-dives/state.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,'clinical-state');const {useClinicalStore:store,effects,clinicalURL,steps}=m.exports,get=()=>store.getState();
test('each caption step and scene stage share one state',()=>{for(const topic of ['dvt-pe','asthma']){get().reset(topic);for(let i=0;i<steps[topic].length;i++){get().act({step:i});assert.equal(get().view.stage,steps[topic][i]);assert.equal(get().view.step,i)}}});
test('pause freezes shared animation',()=>{get().act({playing:false});const before=get().view;get().tick(.1);assert.deepEqual(get().view,before)});
test('anticoagulants stop growth and illustrate slow endogenous clearance',()=>{get().act({stage:'anticoagulant'});const a=effects(get().view).clot;get().act({time:10});assert(effects(get().view).clot<a);assert(effects(get().view).clot>0)});
test('thrombolysis clears faster than endogenous clearance',()=>{get().act({stage:'thrombolytic'});get().act({time:5});assert.equal(effects(get().view).clot,0)});
test('rescue relaxes muscle but leaves inflammation',()=>{get().reset('asthma');get().act({stage:'rescue'});get().act({time:4});assert(effects(get().view).muscle<.1);assert.equal(effects(get().view).swelling,1)});
test('controller time lapse reduces inflammation',()=>{get().act({stage:'controller'});get().act({time:12});assert(effects(get().view).swelling<.1)});
test('large PE reduces perfusion more than smaller PE',()=>{get().reset('dvt-pe');get().act({stage:'impact'});const a=effects(get().view).obstruction;get().act({large:true});assert(effects(get().view).obstruction>a)});
test('deep links restore every meaningful control',()=>{get().act({stage:'journey',large:true,compare:true,theme:'dark',speed:.35});get().act({time:7});const v=get().view,u=clinicalURL(v);get().restore('dvt-pe',u.split('?')[1]);for(const k of ['stage','large','compare','theme','speed','time','playing'])assert.equal(get().view[k],v[k])});

test('anticoagulant treatment preserves a leg clot location without creating PE',()=>{get().reset('dvt-pe');get().act({stage:'clot'});get().act({stage:'anticoagulant'});assert.equal(get().view.embolized,false);assert.equal(effects(get().view).journey,0);assert.equal(get().view.zoom,1)});

test('caption journey and treatment preserve PE, previous normal clears it',()=>{get().reset('dvt-pe');get().act({step:3});assert.equal(get().view.embolized,true);get().act({step:5});assert.equal(effects(get().view).journey,1);get().act({step:0});assert.equal(get().view.embolized,false);assert.equal(effects(get().view).obstruction,0)});

test('caption rescue follows the inhaler puff into the cross-section',()=>{get().reset('asthma');get().act({step:2});assert.equal(get().view.zoom,2);for(let i=0;i<9;i++)get().tick(.25);assert.equal(get().view.zoom,3)});

test('controller time lapse reduces the response to a later trigger and survives URL restoration',()=>{get().reset('asthma');get().act({stage:'attack',time:3});const untreated=effects(get().view).muscle;get().act({stage:'controller'});for(let i=0;i<48;i++)get().tick(.25);get().act({stage:'attack',trigger:'Smoke',time:3});assert(effects(get().view).muscle<untreated);const url=clinicalURL(get().view);get().restore('asthma',url.split('?')[1]);assert.equal(get().view.control,1)});

test('URL navigation always invalidates the camera target, including repeated popstate',()=>{get().reset('asthma');const a=get().view.revision;get().restore('asthma','zoom=3&playing=0');const b=get().view.revision;assert(b>a);get().restore('asthma','zoom=0&playing=0');assert(get().view.revision>b)});
