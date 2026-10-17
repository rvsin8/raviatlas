"""Centerlines from registered source triangle-plane intersections. No recentering.
Chamber transit joins real chamber centers; this is a schematic flow trajectory,
not segmented intracardiac fluid. Surface geometry is preserved in the GLB.
"""
import json,numpy as np
from scipy.ndimage import gaussian_filter1d
from scipy.spatial import cKDTree
from pathlib import Path
parts=json.load(open('scripts/clinical-deep-dives/extracted-parts.json'))
paths={};bounds={}
for key,part in parts.items():
 tris=np.array(part['positions']).reshape(-1,3,3);verts=tris.reshape(-1,3)
 lo=verts.min(0);hi=verts.max(0);bounds[key]=[lo.tolist(),hi.tolist()]
 axis=int(np.argmax(hi-lo));points=[]
 for level in np.linspace(lo[axis]+(hi[axis]-lo[axis])*.03,hi[axis]-(hi[axis]-lo[axis])*.03,40):
  hits=[]
  for a,b in [(0,1),(1,2),(2,0)]:
   v,w=tris[:,a],tris[:,b];da=v[:,axis]-level;db=w[:,axis]-level;mask=da*db<0;t=da[mask]/(da[mask]-db[mask]);hits.extend(v[mask]+t[:,None]*(w[mask]-v[mask]))
  if len(hits)>2:points.append(np.unique(np.round(hits,6),axis=0).mean(0))
 points=gaussian_filter1d(np.array(points),.8,axis=0,mode='nearest')
 if len(points)<3:raise RuntimeError('No real centerline: '+key)
 radii=cKDTree(verts).query(points)[0]
 paths[key]={'points':points.tolist(),'radii':radii.tolist(),'sourceIds':part['sourceIds']}
# Orient venous transit upwards, pulmonary paths away from the trunk.
journey=[];stages=[]
for key in ['calfVein','popliteal','femoral','iliac','ivc','rightAtrium','rightVentricle','pulmonaryTrunk','rightPulmonary']:
 p=np.array(paths[key]['points'])
 if journey:
  if np.linalg.norm(p[-1]-journey[-1])<np.linalg.norm(p[0]-journey[-1]):p=p[::-1]
 elif p[0,1]>p[-1,1]:p=p[::-1]
 if key in ['rightAtrium','rightVentricle']:p=np.array([np.mean(bounds[key],axis=0)])
 stages.append({'id':key,'index':len(journey)});journey.extend(p)
result={'_review':'pending','source':'BodyParts3D 4.0 / DBCLS, CC BY 4.0','method':'Triangle-plane intersections of original registered world geometry. Transit between vessels and right-heart chamber centers is schematic.','paths':paths,'bounds':bounds,'journey':np.array(journey).tolist(),'stages':stages}
Path('public/models/deep-dive/clinical-anatomy.json').write_text(json.dumps(result,separators=(',',':')))
print('Extracted',len(paths),'real centerlines;',len(journey),'journey samples')
