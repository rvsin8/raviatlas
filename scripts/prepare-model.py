"""Repeatable source acquisition, FMA hierarchy mapping, and OBJ grouping. No synthetic geometry."""
import csv,json,hashlib,zipfile,subprocess,sys,struct,re
from pathlib import Path
from collections import defaultdict
S=Path('public/models/source');W=Path('.model-build');W.mkdir(exist_ok=True);S.mkdir(parents=True,exist_ok=True)
FILES=['isa_parts_list_e.txt','partof_parts_list_e.txt','isa_inclusion_relation_list.txt','partof_inclusion_relation_list.txt','isa_element_parts.txt','partof_element_parts.txt','README_e.html','isa_BP3D_4.0_obj_99.zip']
for f in FILES:
 if not (S/f).exists() and '--download' in sys.argv: subprocess.run(['curl','-fL','--retry','2','--max-time','900','-o',str(S/f),'https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/'+f],check=True)
 if not (S/f).exists():raise SystemExit('Missing '+str(S/f)+'. Obtain it from https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html. No primitive fallback.')
def table(f):return list(csv.reader((S/f).open(),delimiter='\t'))[1:]
names={};edges=defaultdict(set);isa=defaultdict(set);members=defaultdict(set)
for f in FILES[:2]:
 for i,_,n in table(f):names[i]=n
for f,e in [(FILES[2],isa),(FILES[3],edges)]:
 for p,pn,c,cn in table(f):names[p]=pn;names[c]=cn;e[p].add(c)
for f in FILES[4:6]:
 for i,n,m in table(f):names[i]=n;members[i].add(m)
byname=defaultdict(list)
for i,n in names.items():byname[n].append(i)
def expand(ids,e=edges):
 seen=set();out=set();stack=list(ids)
 while stack:
  i=stack.pop()
  if i in seen:continue
  seen.add(i);out.update(members[i]);stack.extend(e[i])
 return out
anchors={
'head':['head','cranium','skull'],'neck':['neck'],'chest':['thorax','aorta','pulmonary trunk','superior vena cava','inferior vena cava'],'abdomen':['abdomen'],'pelvis':['pelvis'],'back':['back of thorax','back of abdomen'],'arm':['right upper limb','left upper limb'],'hand':['right hand','left hand'],'leg':['right lower limb','left lower limb'],'foot':['right foot','left foot'],
'brain':['brain'],'eyes':['right eyeball','left eyeball'],'ears':['external ear'],'nose-sinuses':['nose'],'mouth-teeth':['mouth','tooth'],'jaw':['mandible'],'face':['face'],
 'throat':['muscle of pharynx','subdivision of pharynx'],'larynx':['laryngeal cartilage','muscle of larynx','intrinsic ligament of larynx'],'thyroid':[],'cervical-spine':['cervical vertebral column','cervical vertebra'],
 'heart':['heart'],'lungs':['right lung','left lung','trachea'],'breast':[],'ribs-sternum':['rib cage','sternum'],'esophagus':['esophagus'],'diaphragm':['diaphragm'],
 'stomach':['stomach'],'liver-gallbladder':['liver','gallbladder'],'pancreas':['pancreas'],'intestines':['small intestine','large intestine'],'kidneys':['right kidney','left kidney'],'spleen':['spleen'],'appendix':['appendix'],'bladder':['urinary bladder'],'reproductive-organs':['genital system'],'rectum-anus':['rectum','anal canal'],
 'thoracic-spine':['thoracic vertebral column','thoracic vertebra'],'lumbar-spine':['lumbar vertebral column','lumbar vertebra'],'spinal-cord':['spinal cord'],'sacrum-tailbone':['sacrum','coccyx'],
 'shoulder':['right shoulder','left shoulder','muscle of shoulder','right pectoral girdle','left pectoral girdle'],'upper-arm':['right arm','left arm','humerus','muscle of arm'],'elbow':['anconeus'],'forearm':['right forearm','left forearm','muscle of forearm'],
 'wrist':['right wrist','left wrist','carpal bone'],'palm':['metacarpal bone','muscle of hand'],'fingers-thumb':['phalanx of finger','phalanx of thumb'],'hip':['right hip','left hip','muscle of pelvis','gluteus maximus','gluteus medius','gluteus minimus'],'thigh':['right thigh','left thigh','muscle of thigh'],'knee':['right knee','left knee','patella'],'shin':['tibia','fibula','muscle of anterior compartment of leg'],'calf':['gastrocnemius','soleus','muscle of posterior compartment of leg','muscle of lateral compartment of leg'],'ankle':['talus'],'heel':['calcaneus'],'arch':['metatarsal bone','tarsal bone'],'toes':['phalanx of toe'],'skin':['skin']}
# PART-OF plus IS-A subtype closure links regional structures omitted by the sparse PART-OF export.
combined=defaultdict(set)
for e in [edges,isa]:
 for k,vs in e.items():combined[k].update(vs)
overrides=json.load(open('data/mesh-overrides.json'));regions=json.load(open('data/regions.json'));reg={r['id']:r for r in regions['regions']}
anchor_report={};regionparts={}
for r,labels in anchors.items():
 ids=[i for n in labels for i in byname[n]]+overrides.get('fmaAnchors',{}).get(r,[]);regionparts[r]=expand(ids,combined)
 anchor_report[r]={'fmaIds':ids,'names':[names[i] for i in ids],'unresolved':[n for n in labels if not byname[n]],'parts':len(regionparts[r])}
tissue_names={'skin':['skin'],'bone':['bone organ'],'muscle':['muscle organ'],'artery':['artery','arterial tree'],'vein':['vein','venous tree'],'nerve':['nerve','nervous system']}
tissueparts={t:expand([i for n in ns for i in byname[n]],isa) for t,ns in tissue_names.items()}
concepts=defaultdict(list)
for c,ms in members.items():
 for m in ms:concepts[m].append(c)
priority='skin larynx thyroid brain eyes ears nose-sinuses jaw mouth-teeth ribs-sternum heart lungs diaphragm esophagus stomach liver-gallbladder pancreas kidneys spleen appendix bladder reproductive-organs rectum-anus intestines spinal-cord cervical-spine thoracic-spine lumbar-spine sacrum-tailbone knee ankle heel toes fingers-thumb wrist palm arch calf shin elbow shoulder upper-arm forearm hip thigh face throat hand foot back head neck chest abdomen pelvis arm leg'.split()
report={'source':'BodyParts3D 4.0 + thyroid 4.3','license':'CC-BY-4.0','anchors':anchor_report,'kept':[],'excluded':[],'unmapped':[],'sha256':{f:hashlib.sha256((S/f).read_bytes()).hexdigest() for f in FILES}}
source_names={};parts=[];lo=[float('inf')]*3;hi=[-float('inf')]*3
with zipfile.ZipFile(S/FILES[-1]) as z:
 for filename in sorted(z.namelist()):
  if not filename.endswith('.obj'):continue
  fid=Path(filename).stem;cs=sorted(concepts[fid],key=lambda c:len(members[c]));labels=[names[c] for c in cs[:8]];manual=overrides['parts'].get(fid,{})
  rid=manual.get('regionId') or next((r for r in priority if fid in regionparts[r]),None)
  if not rid:
   report['unmapped'].append({'fileId':fid,'labels':labels,'reason':'Rendered but not clickable; region mapping pending'});rid='unmapped'
  tissue=manual.get('tissue') or next((t for t in ['skin','artery','vein','muscle','bone','nerve'] if fid in tissueparts[t]),'organ')
  if rid=='larynx' and tissue=='organ':tissue='cartilage'
  v=[];ix=[]
  source_text=z.read(filename).decode();match=re.search(r'# English name\s*:\s*([^\n]+)',source_text);source_names[fid]=match.group(1).strip() if match else fid
  for line in source_text.splitlines():
   if line.startswith('v '):v.append(tuple(map(float,line.split()[1:4])))
   elif line.startswith('f '):
    face=[int(x.split('/')[0])-1 for x in line.split()[1:]]
    for j in range(1,len(face)-1):ix.extend([face[0],face[j],face[j+1]])
  if not ix:continue
  mn=[min(p[j] for p in v) for j in range(3)];mx=[max(p[j] for p in v) for j in range(3)];extent=max(mx[j]-mn[j] for j in range(3));reason=None
  # Keep every real part. No anatomical exclusions, including unmapped structures.
  item={'fileId':fid,'regionId':rid,'tissue':tissue,'labels':labels,'sourceConcepts':cs,'triangles':len(ix)//3,'assignment':'manual' if manual.get('regionId') else 'FMA PART-OF, IS-A and composition'}
  if reason:item['reason']=reason;report['excluded'].append(item);continue
  report['kept'].append(item);parts.append((fid,rid,tissue,v,ix))
  for j in range(3):lo[j]=min(lo[j],mn[j]);hi[j]=max(hi[j],mx[j])
# Verify shared reference in raw millimetres, then use identical normalization for 4.3 gland.
def vertices(text):return [tuple(map(float,l.split()[1:4])) for l in text.splitlines() if l.startswith('v ')]
def ext(v):return [[min(p[j] for p in v) for j in range(3)],[max(p[j] for p in v) for j in range(3)]]
with zipfile.ZipFile(S/FILES[-1]) as z:old=vertices(z.read('isa_BP3D_4.0_obj_99/FJ2808.obj').decode())
ref=next((S/'4.3/thyroid').rglob('FJ2808*.obj'));new=vertices(ref.read_text())
delta=max(abs(a-b) for x,y in zip(ext(old),ext(new)) for a,b in zip(x,y))
if delta>.01:raise SystemExit('4.3 reference does not align; no approximate transform permitted')
report['thyroidAlignment']={'parentFMA':'FMA9603','parts':['FJ3670','FJ3671','FJ3672'],'referenceFMA':'FMA55099','referenceBoundsDeltaMM':delta,'transform':'Same raw millimetres and Z-up coordinates; no manual registration'}
for fid in ['FJ3670','FJ3671','FJ3672']:
 f=next((S/'4.3/thyroid').rglob(fid+'*.obj'));txt=f.read_text();v=vertices(txt);ix=[]
 for l in txt.splitlines():
  if l.startswith('f '):
   face=[int(x.split('/')[0])-1 for x in l.split()[1:]]
   for j in range(1,len(face)-1):ix.extend([face[0],face[j],face[j+1]])
 b=ext(v)
 if not (1350<b[0][2]<b[1][2]<1440 and max(abs(b[0][0]),abs(b[1][0]))<30):raise SystemExit('Thyroid outside expected source neck bounds; stop for review')
 report['kept'].append({'fileId':fid,'regionId':'thyroid','tissue':'organ','labels':[f.stem],'sourceConcepts':['FMA9603'],'triangles':len(ix)//3,'assignment':'4.3 FMA PART-OF and composition','sourceVersion':'4.3'})
 parts.append((fid,'thyroid','organ',v,ix))
# Separate only existing pectoralis surfaces into an addressable node, not breast geometry.
pectoral_ids={fid for fid,r,t,v,ix in parts if any('pectoralis major' in names[c] for c in concepts[fid])}
parts=[(fid,'pectoral-surface' if fid in pectoral_ids else r,t,v,ix) for fid,r,t,v,ix in parts]
reg['pectoral-surface']={'parentId':'chest'}
reg['unmapped']={'parentId':None}
required={'heart','larynx','knee','skin'}
if not required.issubset({p[1] for p in parts}):
 json.dump(report,open('data/model-reports/build-report.json','w'),indent=2);raise SystemExit('Required region missing: '+str(required-{p[1] for p in parts}))
# One identical rigid axis rotation and uniform unit conversion; NO centering.
# Rx(-90 degrees) * S(.001): (x,y,z) -> (.001*x,.001*z,-.001*y).
scale=.001;groups={};bounds={};sourceparts=[]
def bound(r,p):
 b=bounds.setdefault(r,{'min':[float('inf')]*3,'max':[-float('inf')]*3})
 for j in range(3):b['min'][j]=min(b['min'][j],p[j]);b['max'][j]=max(b['max'][j],p[j])
for fid,r,t,v,ix in parts:
 g=groups.setdefault(fid,{'regionId':r,'tissue':t,'fileId':fid,'positions':[],'indices':[]});offset=len(g['positions'])//3
 for x,y,z in v:
  p=[x*scale,z*scale,-y*scale];g['positions'].extend(p);bound(r,p)
  if reg[r]['parentId']:bound(reg[r]['parentId'],p)
  bound('body',p)
 g['indices'].extend(i+offset for i in ix)
 sourceparts.append({'sourceName':source_names.get(fid,fid),'fileId':fid,'regionId':r,'labels':next((x['labels'] for x in report['kept'] if x['fileId']==fid),[]),'sourceMM':ext(v),'worldBounds':ext([(x*.001,z*.001,-y*.001) for x,y,z in v])})
manifest=[]
for idx,g in enumerate(groups.values()):
 p=W/f'{idx}.pos';i=W/f'{idx}.idx';p.write_bytes(struct.pack('<%sf'%len(g['positions']),*g.pop('positions')));i.write_bytes(struct.pack('<%sI'%len(g['indices']),*g.pop('indices')));g.update(positionFile=str(p),indexFile=str(i));manifest.append(g)
report['normalization']={'sourceAxis':'Z-up','sourceMin':lo,'sourceMax':hi,'scale':scale,'rotationXDegrees':-90,'translation':[0,0,0]};bounds['breast']=bounds['pectoral-surface']
report['missingRegionGeometry']=[r for r in reg if r!='systemic' and not any(g['regionId']==r or reg[g['regionId']]['parentId']==r for g in manifest)]
json.dump(sourceparts,open('data/model-reports/source-part-bounds.json','w'),indent=2);json.dump(manifest,open(W/'groups.json','w'));json.dump(bounds,open('data/model-bounds.json','w'),indent=2);json.dump(report,open('data/model-reports/build-report.json','w'),indent=2);json.dump(report['unmapped'],open('data/model-unmapped.json','w'),indent=2)
print('Prepared',len(parts),'parts;',len(report['unmapped']),'unmapped;',len(report['excluded']),'excluded. Missing:',report['missingRegionGeometry'])

summary={'automatic':[x for x in report['kept']+report['excluded'] if x['assignment']!='manual'],'overrides':[x for x in report['kept']+report['excluded'] if x['assignment']=='manual'],'stillUnmappedByLikelyRegion':{}}
for x in report['unmapped']:
 likely=overrides['parts'].get(x['fileId'],{}).get('likelyRegion','undetermined');summary['stillUnmappedByLikelyRegion'].setdefault(likely,[]).append(x)
summary['counts']={'automatic':len(summary['automatic']),'overrides':len(summary['overrides']),'stillUnmapped':len(report['unmapped']),'rendered':len(report['kept']),'mappedButExcluded':len(report['excluded'])}
json.dump(summary,open('data/model-reports/mapping-review.json','w'),indent=2)
