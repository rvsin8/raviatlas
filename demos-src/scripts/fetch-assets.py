import pathlib,urllib.request,json,shutil
p=pathlib.Path('public');log=[]
def get(url,dest):
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'TenPowers educational atlas source retrieval'})
  b=urllib.request.urlopen(req,timeout=90).read();q=p/dest;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(b);log.append({'url':url,'file':dest,'bytes':len(b),'ok':True});print(dest,len(b),flush=True)
 except Exception as e:log.append({'url':url,'file':dest,'ok':False,'error':str(e)});print(dest,str(e),flush=True)
get('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg','assets/earth.jpg')
get('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/export?bbox=-73.91,40.65,-73.69,40.78&bboxSR=4326&size=1600,1100&imageSR=3857&format=jpg&f=image','assets/queens.jpg')
get('https://files.rcsb.org/download/4AMJ.pdb','data/4AMJ.pdb')
get('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/carvedilol/SDF?record_type=3d','data/molecule.sdf')
get('https://raw.githubusercontent.com/vasturiano/three-globe/master/example/datasets/ne_110m_admin_0_countries.geojson','data/countries.json')
shutil.copy('../rxatlas/public/models/rxatlas-anatomy.glb',p/'models/body.glb')
for n in ['inter-latin.woff2','Inter-LICENSE.txt','jetbrains-mono-latin.woff2','JetBrains-Mono-LICENSE.txt']:
 shutil.copy('../rxatlas/public/fonts/'+n,p/'assets'/n)
(p/'data/assets.json').write_text(json.dumps(log,indent=2))
