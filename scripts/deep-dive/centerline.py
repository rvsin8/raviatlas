"""Derive centerlines from registered BodyParts3D triangle/plane intersections.
No per-part transform, rescaling, or hand-drawn aortic path.
"""
import json, numpy as np
from scipy.interpolate import splprep,splev
from scipy.ndimage import gaussian_filter1d
from pathlib import Path
parts=json.load(open('scripts/deep-dive/extracted-parts.json'))
meshes={k:np.asarray(v['positions']).reshape(-1,3,3) for k,v in parts.items()}
def cut(tris,axis,level):
 pts=[]
 for a,b in [(0,1),(1,2),(2,0)]:
  v,w=tris[:,a],tris[:,b];da=v[:,axis]-level;db=w[:,axis]-level;mask=da*db<0
  t=da[mask]/(da[mask]-db[mask]);pts.extend(v[mask]+t[:,None]*(w[mask]-v[mask]))
 if len(pts)<3:return None
 pts=np.unique(np.round(pts,6),axis=0);center=pts.mean(axis=0)
 return center
paths={}
for k in parts:
 if k in ['coronary','valve']:continue
 tris=meshes[k];verts=tris.reshape(-1,3);span=np.ptp(verts,axis=0);axis=2 if k=='arch' else int(span.argmax());lo,hi=verts[:,axis].min(),verts[:,axis].max();levels=np.linspace(lo+min(.003,span[axis]*.12),hi-min(.003,span[axis]*.12),50)
 points=np.array([p for level in levels if (p:=cut(tris,axis,level)) is not None]);points=gaussian_filter1d(points,1,axis=0,mode='nearest')
 if k in ['arch','descending','abdominal']:points=points[::-1]
 paths[k]=points
# Orient connections by proximity to the preceding segment.
trunk=[];breaks=[]
for k in ['ascending','arch','descending','abdominal']:
 pts=paths[k]
 if len(trunk) and np.linalg.norm(pts[-1]-trunk[-1])<np.linalg.norm(pts[0]-trunk[-1]):pts=pts[::-1]
 breaks.append(len(trunk));trunk.extend(pts)
trunk=np.array(trunk);tck,u=splprep(trunk.T,s=0.000025,k=3);samples=np.array(splev(np.linspace(0,1,321),tck)).T
allverts=np.concatenate([meshes[k].reshape(-1,3) for k in ['ascending','arch','descending','abdominal']])
from scipy.spatial import cKDTree
radii=cKDTree(allverts).query(samples)[0];radii=np.clip(gaussian_filter1d(radii,3),.0055,.0155)
segments=[]
for k,start,end in [('root',0,8),('ascending',8,50),('arch',50,100),('descending',100,150),('abdominal',150,199)]:
 a=int(np.argmin(np.linalg.norm(samples-trunk[start],axis=1)));b=int(np.argmin(np.linalg.norm(samples-trunk[end],axis=1)));segments.append({'id':k,'start':a/320,'end':b/320})
segments[0]['start']=0
for i in range(4):segments[i]['end']=segments[i+1]['start']
segments[-1]['end']=1
branches=[]
meta={
'brachiocephalic':('Brachiocephalic artery','FMA3932','brain'), 'leftCarotid':('Left common carotid','FMA4058','brain'),'leftSubclavian':('Left subclavian','FMA4694','arms'),
'celiac':('Celiac trunk','FMA14812','gut'),'sma':('Superior mesenteric artery','FMA14749','gut'),'rightRenal':('Right renal artery','FMA14752','kidneys'),'leftRenal':('Left renal artery','FMA14753','kidneys'),'leftIliac':('Left common iliac','FMA14766','legs'),'rightIliac':('Right common iliac','FMA14765','legs')}
for k,(label,fma,target) in meta.items():
 points=paths[k];dist=cKDTree(samples).query(points)[0]
 if dist[-1]<dist[0]:points=points[::-1]
 origin=int(cKDTree(samples).query(points[0])[1]);branches.append({'id':k,'name':label,'fma':fma,'target':target,'origin':origin/320,'points':points.tolist(),'sourceIds':parts[k]['sourceIds']})
# Clinical arch boundary is immediately distal to the left subclavian origin,
# not the arbitrary end of the source arch surface file.
arch_end=next(b['origin'] for b in branches if b['id']=='leftSubclavian')+.015
segments[2]['end']=arch_end;segments[3]['start']=arch_end
segments[0]['end']=.03;segments[1]['start']=.03
# Additional flow paths follow real branch geometry beyond the named origins.
flow={}
for k in ['rightCarotid','rightSubclavian','leftArm','rightArm','leftLeg','rightLeg']:
 if k in paths:
  points=paths[k];near=cKDTree(samples).query(points)[0]
  if near[-1]<near[0]:points=points[::-1]
  flow[k]=points.tolist()
result={'_review':'pending','source':'BodyParts3D 4.0, extracted from registered GLB; original mm-to-metre and Z-up-to-Y-up transform preserved','method':'Triangle/plane intersections, centroid extraction, cubic smoothing; radii from nearest real surface. Wall layers and dissection are schematic, not patient-specific.','rootNote':'The root is the proximal part of the ascending-aorta mesh FJ3413 (FMA3736), not a separate supplied root mesh.','points':np.round(samples,7).tolist(),'radii':np.round(radii,7).tolist(),'segments':segments,'branches':branches,'flowExtensions':flow,'sourceIds':{k:v['sourceIds'] for k,v in parts.items()},'fma':{'ascending':'FMA3736','arch':'FMA3768','descending':'FMA87217','abdominal':'FMA3789'},'bounds':[samples.min(axis=0).tolist(),samples.max(axis=0).tolist()]}
Path('public/models/deep-dive/aorta.json').write_text(json.dumps(result,separators=(',',':')))
print(json.dumps({'samples':len(samples),'bounds':result['bounds'],'radiusRange': [float(radii.min()),float(radii.max())],'segments':segments,'branches':[(b['id'],round(b['origin'],3)) for b in branches]},indent=2))
