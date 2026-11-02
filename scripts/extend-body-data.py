import json,pathlib
p=pathlib.Path('data')
def read(n):return json.loads((p/n).read_text())
def save(n,d):(p/n).write_text(json.dumps(d,indent=2)+'\n')
rd=read('regions.json');by={r['id']:r for r in rd['regions']};source='https://apps.humanatlas.io/kg-explorer/ref-organ/united-female/v1.10'
for rid,name,sex in [('uterus','Uterus','female'),('ovaries','Ovaries','female'),('fallopian-tubes','Fallopian tubes','female'),('prostate','Prostate','male'),('testes','Testes','male')]:
 if rid not in by:rd['regions'].append({'id':rid,'name':name,'parentId':'pelvis','cameraPosition':by['pelvis']['cameraPosition'],'cameraTarget':by['pelvis']['cameraTarget'],'position':by['pelvis']['position'],'meshIds':[],'sex':sex,'sources':[source if sex=='female' else 'https://dbarchive.biosciencedbc.jp/en/bodyparts3d/']})
save('regions.json',rd)
cd=read('conditions.json')
source_map={'migraine':'migraine.html','tension-headache':'headache.html','glaucoma':'glaucoma.html','allergic-rhinitis':'allergy.html','otitis-media':'earinfections.html','tmj-disorder':'temporomandibulardisorders.html','dental-caries':'toothdecay.html','strep-throat':'streptococcalinfections.html','hypothyroidism':'hypothyroidism.html','asthma':'asthma.html','copd':'copd.html','stable-angina':'angina.html','gerd':'gerd.html','ibs-c':'irritablebowelsyndrome.html','constipation':'constipation.html','ulcerative-colitis':'ulcerativecolitis.html','cystitis':'urinarytractinfections.html','overactive-bladder':'bladderdiseases.html','bph':'enlargedprostatebph.html','dysmenorrhea':'periodpain.html','carpal-tunnel':'carpaltunnelsyndrome.html','knee-osteoarthritis':'osteoarthritis.html','atopic-dermatitis':'eczema.html','acne':'acne.html','minor-burn':'burns.html','urticaria':'hives.html','type-1-diabetes':'diabetestype1.html','type-2-diabetes':'diabetestype2.html','hypertension':'highbloodpressure.html','lupus':'lupus.html','rheumatoid-arthritis':'rheumatoidarthritis.html','hyperlipidemia':'cholesterol.html','neck-strain':'neckinjuriesanddisorders.html','rib-fracture':'chestinjuriesanddisorders.html','low-back-strain':'backpain.html','rotator-cuff-tear':'rotatorcuffinjuries.html','tennis-elbow':'elbowinjuriesanddisorders.html','forearm-fracture':'arminjuriesanddisorders.html','hand-osteoarthritis':'osteoarthritis.html','wrist-sprain':'wristinjuriesanddisorders.html','acl-tear':'kneeinjuriesanddisorders.html','hamstring-strain':'sprainsandstrains.html','shin-splints':'leginjuriesanddisorders.html','ankle-sprain':'ankleinjuriesanddisorders.html','plantar-fasciitis':'heelinjuriesanddisorders.html','athletes-foot':'athletesfoot.html'}
for c in cd['conditions']:
 c['sex']='male' if c['id']=='bph' else 'female' if c['id'] in ['dysmenorrhea','lactational-mastitis'] else 'both'
 c['sources']=[c.get('source') or 'https://medlineplus.gov/'+source_map.get(c['id'],'healthtopics.html')]
 if c['id']=='bph':c['regionIds']=['prostate']
 if c['id']=='dysmenorrhea':c['regionIds']=['uterus']
 if c['id']=='migraine':c['sex_differences']=[{'summary':'Migraine occurs more often in women than in men. Hormonal changes can trigger attacks.','sources':['https://medlineplus.gov/ency/article/000709.htm'],'_review':'pending'}]
save('conditions.json',cd)
dd=read('drugs.json')
for d in dd['drugs']:
 if d['id']=='lisinopril':
  url='https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1d0caa63-9ea2-4a97-a23b-900a7c514bc6'
  d['pregnancy_lactation']={'pregnancy':'The FDA label warns that lisinopril can harm the fetus, particularly through effects on fetal kidney function.','lactation':'The label reports no human milk data and advises against breastfeeding during treatment because of potential serious effects in an infant.','label':url,'sources':[url],'sections':['8.1','8.2'],'_review':'pending'}
save('drugs.json',dd)
raw=read('model-reports/source-part-bounds.json');parts={'prostate':[],'testes':[]}
for i,x in enumerate(raw):
 n=x.get('sourceName','').lower()
 if n=='prostate':parts['prostate'].append(i)
 if n in ['left testis','right testis']:parts['testes'].append(i)
save('male-sex-specific-parts.json',parts)
mb=read('model-bounds.json')
for id,ids in parts.items():
 boxes=[raw[i]['worldBounds'] for i in ids];mb[id]={'min':[min(b[0][j] for b in boxes) for j in range(3)],'max':[max(b[1][j] for b in boxes) for j in range(3)]}
mb['reproductive-organs']={a:[f(mb[k][a][i] for k in ['prostate','testes']) for i in range(3)] for a,f in [('min',min),('max',max)]}
save('model-bounds-male.json',mb)
h={r['id']:r['meshIds'] for r in rd['regions']};h['prostate']=['prostate'];h['testes']=['testes'];h['pelvis']=list(dict.fromkeys(h['pelvis']+['prostate','testes']));h['reproductive-organs']=list(dict.fromkeys(h['reproductive-organs']+['prostate','testes']));h={k:list(dict.fromkeys('prostate' if n=='reproductive-organs' else n for n in v)) for k,v in h.items()};save('hotspots-male.json',h)
