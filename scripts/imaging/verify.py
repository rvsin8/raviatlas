"""Fail on spatial mismatch, changed source masks, invalid geometry or measurements."""
from pathlib import Path
import json,gzip,hashlib,struct,time
import numpy as np
import nibabel as nib
from skimage.measure import marching_cubes
from scipy.spatial import cKDTree
ROOT=Path(__file__).resolve().parents[2];m=json.loads((ROOT/'data/imaging/case.json').read_text());out=ROOT/'public/imaging/msd-brain';checks=[];start=time.perf_counter()
def check(name,condition):
 assert condition,name
 checks.append({'check':name,'pass':True})
for name,meta in m['files'].items():
 b=(out/name).read_bytes();check('Asset SHA-256 and length: '+name,len(b)==meta['bytes'] and hashlib.sha256(b).hexdigest()==meta['sha256'])
mask=np.frombuffer(gzip.decompress((out/'labels.u8.gz').read_bytes()),dtype=np.uint8).reshape(m['dimensions'],order='F');A=np.array(m['affineRAS']);R=np.array(m['voxelToScene']);D=np.array(m['dimensions'])
check('Canonical positive RAS axes',nib.aff2axcodes(A)==('R','A','S'))
check('Isotropic millimeter calibration',np.allclose(nib.affines.voxel_sizes(A),m['spacingMm']) and abs(np.linalg.det(A[:3,:3]))==m['voxelVolumeMm3'])
corners=np.array([[x,y,z] for x in [0,D[0]-1] for y in [0,D[1]-1] for z in [0,D[2]-1]])
world=nib.affines.apply_affine(R,corners);check('All 8 corners round-trip between voxel and 3D',np.allclose(nib.affines.apply_affine(np.linalg.inv(R),world),corners,atol=1e-8))
check('Render transform is a single uniform mm-to-m rotation',np.allclose(R,np.array([[.001,0,0,0],[0,0,.001,0],[0,-.001,0,0],[0,0,0,1.]])@A))
for c in m['classes']:
 n=int(np.count_nonzero(mask==c['id']));check('Native-mask count and volume: '+c['name'],n==c['voxels'] and abs(n*abs(np.linalg.det(A[:3,:3]))/1000-c['volumeMl'])<1e-10)
 check('Finding focus lands inside its own label: '+c['name'],mask[tuple(c['focusVoxel'])]==c['id'])
raw=(out/'surfaces.glb').read_bytes();jlen=struct.unpack_from('<I',raw,12)[0];g=json.loads(raw[20:20+jlen]);binary=raw[28+jlen:]
def accessor(i):
 a=g['accessors'][i];v=g['bufferViews'][a['bufferView']];dtype={5126:'<f4',5125:'<u4'}[a['componentType']];size={'VEC3':3,'SCALAR':1}[a['type']]
 return np.frombuffer(binary,dtype=dtype,count=a['count']*size,offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,size)
for mesh in g['meshes']:
 primitive=mesh['primitives'][0];vertices=accessor(primitive['attributes']['POSITION']);ix=accessor(primitive['indices']);v=nib.affines.apply_affine(np.linalg.inv(R),vertices)
 check(mesh['name']+' geometry finite and indices valid',np.isfinite(vertices).all() and ix.max()<len(vertices))
 check(mesh['name']+' triangle count',len(ix)//3==m['surfaces'][mesh['name']]['triangles'])
 if mesh['name'].startswith('class-'):
  label=int(mesh['name'][-1]);reference,_,_,_=marching_cubes((mask==label).astype(float),level=.5,allow_degenerate=False);distance,_=cKDTree(reference).query(v);check(mesh['name']+' physical vertices invert onto native-mask surface',float(distance.max())<.0001)
source=ROOT/'.model-build/imaging';native_checked=False
if (source/'image.nii.gz').exists():
 image=nib.load(source/'image.nii.gz');labels=nib.load(source/'labels.nii.gz');check('Native MRI and label grid/affine agree',image.shape[:3]==labels.shape and np.allclose(image.affine,labels.affine))
 check('Published mask exactly equals canonical source mask',np.array_equal(mask,np.asarray(nib.as_closest_canonical(labels).dataobj,dtype=np.uint8)));native_checked=True
 for f in m['provenance']['files']:check('Source hash: '+f['path'],hashlib.sha256((source/f['path']).read_bytes()).hexdigest()==f['sha256'])
 for s in m['sequences']:
  q=np.frombuffer(gzip.decompress((out/s['url'].split('/')[-1]).read_bytes()),dtype='<u2').reshape(m['dimensions'],order='F');original=nib.as_closest_canonical(image).get_fdata(dtype=np.float32)[:,:,:,s['channel']]
  err=np.max(np.abs(q.astype(float)*s['scale']+s['intercept']-original));check('Signal quantization error bounded: '+s['name'],err<=s['scale']*.501+1e-3)
report={'case':m['id'],'checks':checks,'passed':len(checks),'nativeSourceChecked':native_checked,'assetBytes':sum(v['bytes'] for v in m['files'].values()),'triangles':sum(v['triangles'] for v in m['surfaces'].values()),'hostValidationSeconds':round(time.perf_counter()-start,3),'browserPerformance':{'desktop':None,'mobile':None,'reason':'Browser QA unavailable in managed environment; no FPS or browser screenshots claimed'},'clinicalValidation':'pending qualified review'}
(ROOT/'data/imaging/verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
