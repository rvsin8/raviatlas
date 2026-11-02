"""Download source structures only. Never generate or infer molecular coordinates."""
import json,time,urllib.request,urllib.error,urllib.parse,sys
from pathlib import Path
D=Path('data/molecules');P=Path('public/molecules');D.mkdir(exist_ok=True);P.mkdir(exist_ok=True)
refresh='--refresh' in sys.argv
base='https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'
def fetch(url):
 for attempt in range(3):
  try:
   time.sleep(.26)
   return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'RxAtlas educational structure builder'}),timeout=12).read()
  except urllib.error.HTTPError as e:
   if e.code==404:raise
   if attempt==2:raise
   time.sleep(2*(attempt+1))
  except Exception:
   if attempt==2:raise
   time.sleep(2)
def small(key,name,note=''):
 path=D/(key+'.json')
 if path.exists() and not refresh and json.loads(path.read_text()).get('kind')=='small':return json.loads(path.read_text())
 identity='cid/11963622' if key=='nitroprusside' else 'name/'+urllib.parse.quote(name)
 url=base+identity+'/property/MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,IsomericSMILES/JSON'
 raw=json.loads(fetch(url));v=raw['PropertyTable']['Properties'][0];cid=v['CID']
 r={'id':key,'name':name,'kind':'small','cid':cid,'formula':v['MolecularFormula'],'molecularWeight':v['MolecularWeight'],'iupacName':v['IUPACName'],'canonicalSmiles':v.get('ConnectivitySMILES',v.get('CanonicalSMILES')),'isomericSmiles':v.get('SMILES',v.get('IsomericSMILES')),'sourceUrl':f'https://pubchem.ncbi.nlm.nih.gov/compound/{cid}','propertyUrl':url,'pubchemProperties':v,'note':note}
 try:sdf=fetch(base+f'cid/{cid}/SDF?record_type=3d');r['dimension']=3
 except urllib.error.HTTPError as e:
  if e.code!=404:raise
  sdf=fetch(base+f'cid/{cid}/SDF?record_type=2d');r['dimension']=2;r['structureNote']='3D structure not available.'
 r['sdfUrl']='/molecules/'+key+'.sdf';(P/(key+'.sdf')).write_bytes(sdf);path.write_text(json.dumps(r,indent=2)+'\n');return r
aliases={'fluticasone':('fluticasone propionate','Active ester shown; inhaled formulation.'),'fluticasone-nasal':('fluticasone propionate','Fluticasone propionate is the active ester shown.'),'ofloxacin-otic':('ofloxacin',''),'metronidazole-topical':('metronidazole',''),'tiotropium':('tiotropium','Active tiotropium ion shown; bromide counterion omitted.'),'levothyroxine':('levothyroxine','Active molecule shown; sodium salt used in drug products.'),'tamsulosin':('tamsulosin','Active molecule shown; hydrochloride salt omitted.'),'hydroxychloroquine':('hydroxychloroquine','Active molecule shown; sulfate salt omitted.'),'alendronate':('alendronic acid','Active acid shown; sodium salt omitted.'),'tenofovir-disoproxil':('tenofovir disoproxil','Active prodrug shown; fumarate counterion omitted.'),'labetalol':('labetalol','Active molecule shown; hydrochloride salt omitted.'),'esmolol':('esmolol','Active molecule shown; hydrochloride salt omitted.'),'nitroprusside':('nitroprusside','Active nitroprusside composition shown without sodium. PubChem represents this coordination complex as disconnected ionic components.'),'nystatin':('nystatin A1','Representative nystatin A1 component; nystatin is a mixture.')}
proteins={'alteplase':('1RTF','Tissue plasminogen activator','Representative experimental catalytic domain of human tissue plasminogen activator; not the complete alteplase protein.'),'insulin-glargine':('6K59','Insulin analogue','Experimental NMR structure of insulin glargine; first deposited model shown.'),'insulin-lispro':('1LPH','Insulin analogue','Representative experimental insulin lispro structure.'),'pancrelipase':('1ETH','Pancreatic enzyme mixture','Representative porcine pancreatic lipase–colipase complex. Pancrelipase also contains amylase and proteases; this is not the full mixture.')}
combos={'amoxicillin-clavulanate':['amoxicillin','clavulanic acid'],'sofosbuvir-velpatasvir':['sofosbuvir','velpatasvir']}
records=json.load(open('data/drugs.json'))['drugs']+[{'id':x,'generic':x} for x in ['labetalol','esmolol','nitroprusside']]
report={'missing':[],'twoDimensional':[],'proteins':[],'ready':[],'verificationOnly':['labetalol','esmolol','nitroprusside']}
for drug in records:
 key=drug['id'];path=D/(key+'.json')
 try:
  if key in proteins:
   pdb,typ,note=proteins[key];url=f'https://files.rcsb.org/download/{pdb}.pdb'
   if not (P/(key+'.pdb')).exists() or refresh:(P/(key+'.pdb')).write_bytes(fetch(url))
   r={'id':key,'kind':'protein','name':drug['generic'],'pdbId':pdb,'proteinType':typ,'pdbUrl':'/molecules/'+key+'.pdb','sourceUrl':f'https://www.rcsb.org/structure/{pdb}','note':note};path.write_text(json.dumps(r,indent=2)+'\n');report['proteins'].append(key)
  elif key in ['heparin','enoxaparin']:
   r={'id':key,'kind':'unavailable','name':drug['generic'],'reason':'A mixture of sulfated polysaccharide chains with different lengths and compositions. No single molecular structure represents this medicine.'};path.write_text(json.dumps(r,indent=2)+'\n');report['missing'].append({'id':key,'reason':r['reason']})
  elif key=='polyethylene-glycol':
   r={'id':key,'kind':'unavailable','name':drug['generic'],'reason':'Polyethylene glycol 3350 is a distribution of polymer chain lengths, not a single molecule with one formula, mass, or conformer. No arbitrary oligomer is substituted.'};path.write_text(json.dumps(r,indent=2)+'\n');report['missing'].append({'id':key,'reason':r['reason']})
  elif key in combos:
   ids=[]
   for name in combos[key]:
    cid=name.replace(' ','-');small(cid,name);ids.append(cid)
   r={'id':key,'kind':'combination','name':drug['generic'],'components':ids,'note':'Each active ingredient is shown separately; formulas and masses refer to the selected ingredient.'};path.write_text(json.dumps(r,indent=2)+'\n')
  else:
   name,note=aliases.get(key,(key.replace('-',' '),''));r=small(key,name,note)
   if r['dimension']==2:report['twoDimensional'].append(key)
  report['ready'].append(key);print(key,r['kind'],r.get('cid',''),r.get('dimension',''),flush=True)
 except Exception as e:
  r={'id':key,'kind':'unavailable','name':drug['generic'],'reason':'Source structure download unavailable: '+str(e)};path.write_text(json.dumps(r,indent=2)+'\n');report['missing'].append({'id':key,'reason':r['reason']});print('MISSING',key,str(e),flush=True)
(D/'build-report.json').write_text(json.dumps(report,indent=2)+'\n')
