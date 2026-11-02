"""Build static MRI assets from a paired MSD NIfTI case, retaining physical registration.
Dependencies: nibabel, numpy, scipy, scikit-image, Pillow. No inference or synthetic scans.
"""
from pathlib import Path
import json,gzip,hashlib,struct,time
import numpy as np
import nibabel as nib
from scipy.ndimage import binary_fill_holes
from skimage.measure import marching_cubes
ROOT=Path(__file__).resolve().parents[2];SRC=ROOT/'.model-build/imaging';OUT=ROOT/'public/imaging/msd-brain';OUT.mkdir(parents=True,exist_ok=True)
start=time.perf_counter();source=json.loads((SRC/'source.json').read_text());dataset=json.loads((SRC/'dataset.json').read_text())
original=nib.load(SRC/'image.nii.gz');original_mask=nib.load(SRC/'labels.nii.gz')
assert original.shape[:3]==original_mask.shape
assert np.allclose(original.affine,original_mask.affine,atol=1e-5),'Image and mask are not registered'
assert original.header.get_xyzt_units()[0] in ('mm','unknown'),'Unexpected spatial unit'
image=nib.as_closest_canonical(original,enforce_diag=True);seg=nib.as_closest_canonical(original_mask,enforce_diag=True)
assert nib.aff2axcodes(image.affine)==('R','A','S')
assert np.allclose(image.affine,seg.affine)
values=image.get_fdata(dtype=np.float32);mask=np.asarray(seg.dataobj,dtype=np.uint8)
assert set(np.unique(mask))=={0,1,2,3};assert np.isfinite(values).all()
A=image.affine;dims=mask.shape;voxel_mm3=float(abs(np.linalg.det(A[:3,:3])))
render=np.array([[.001,0,0,0],[0,0,.001,0],[0,-.001,0,0],[0,0,0,1.]])@A
files={}
def output(name,data):
 (OUT/name).write_bytes(data);files[name]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()};return '/imaging/msd-brain/'+name
mask_url=output('labels.u8.gz',gzip.compress(mask.tobytes(order='F'),mtime=0))
sequences=[]
for channel,title in [(2,'T1 post-contrast'),(0,'FLAIR')]:
 v=values[:,:,:,channel];low=float(v.min());high=float(v.max());scale=(high-low)/65535 or 1
 q=np.rint((v-low)/scale).astype('<u2');p=np.percentile(q[v>0],[1,99.5]);
 sequences.append({'id':dataset['modality'][str(channel)],'name':title,'channel':channel,'url':output(f'sequence-{channel}.u16.gz',gzip.compress(q.tobytes(order='F'),mtime=0)),'intercept':low,'scale':scale,'window':float(p[1]-p[0]),'level':float((p[0]+p[1])/2),'unit':'relative MRI signal (not a standardized clinical unit)'})
# One shared affine for slice planes, cursor, surfaces. No independent centering.
blob=bytearray();views=[];accessors=[];meshes=[];nodes=[];surface_report={}
def accessor(array,type_,component,target):
 while len(blob)%4:blob.append(0)
 at=len(blob);raw=array.tobytes();blob.extend(raw);views.append({'buffer':0,'byteOffset':at,'byteLength':len(raw),'target':target})
 obj={'bufferView':len(views)-1,'componentType':component,'count':len(array),'type':type_}
 if type_=='VEC3':obj.update(min=array.min(0).tolist(),max=array.max(0).tolist())
 accessors.append(obj);return len(accessors)-1
def surface(name,volume,step):
 verts,faces,_,_=marching_cubes(volume.astype(np.float32),level=.5,step_size=step,allow_degenerate=False)
 world=nib.affines.apply_affine(render,verts).astype('<f4');faces=faces.astype('<u4')
 # Normals computed on final physical geometry, not anisotropic voxel coordinates.
 n=np.zeros_like(world);v=world[faces];cross=np.cross(v[:,1]-v[:,0],v[:,2]-v[:,0]);
 for i in range(3):np.add.at(n,faces[:,i],cross)
 n/=np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-12)
 pa=accessor(world,'VEC3',5126,34962);na=accessor(n.astype('<f4'),'VEC3',5126,34962);ix=accessor(faces.reshape(-1),'SCALAR',5125,34963)
 meshes.append({'name':name,'primitives':[{'attributes':{'POSITION':pa,'NORMAL':na},'indices':ix}]});nodes.append({'name':name,'mesh':len(meshes)-1})
 surface_report[name]={'vertices':len(world),'triangles':len(faces),'bounds':[world.min(0).tolist(),world.max(0).tolist()],'stepVoxels':step}
classes=[]
for label in (1,2,3):
 vox=np.argwhere(mask==label);centroid=vox.mean(0);nearest=vox[np.argmin(np.linalg.norm(vox-centroid,axis=1))]
 classes.append({'id':label,'name':dataset['labels'][str(label)].replace('tumour','tumor'),'voxels':len(vox),'volumeMl':len(vox)*voxel_mm3/1000,'focusVoxel':nearest.tolist(),'centroidRAS':nib.affines.apply_affine(A,centroid).tolist(),'boundsVoxel':[vox.min(0).tolist(),vox.max(0).tolist()]})
 surface('class-'+str(label),mask==label,1)
support=binary_fill_holes(np.any(values>0,axis=3));surface('context',support,2)
doc={'asset':{'version':'2.0','generator':'RxAtlas NiBabel + scikit-image; source mask surfaces'},'scene':0,'scenes':[{'nodes':list(range(len(nodes)))}],'nodes':nodes,'meshes':meshes,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':accessors}
j=json.dumps(doc,separators=(',',':')).encode();j+=b' '*((-len(j))%4);blob+=b'\0'*((-len(blob))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob
surface_url=output('surfaces.glb',glb)
sources=['https://medicaldecathlon.com/','https://registry.opendata.aws/msd/','https://doi.org/10.1038/s41467-022-30695-9','https://www.med.upenn.edu/sbia/brats2017.html','https://www.cancer.gov/types/brain/patient/adult-brain-treatment-pdq']
manifest={'id':source['case'],'title':'Annotated glioma MRI','_review':'pending','dataset':'Medical Segmentation Decathlon · Task01 BrainTumour','release':dataset['release'],'license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','attribution':'Medical Segmentation Decathlon / BraTS contributors','sources':sources,'provenance':source,'dimensions':list(dims),'spacingMm':nib.affines.voxel_sizes(A).tolist(),'nativeAffine':original.affine.tolist(),'affineRAS':A.tolist(),'voxelToScene':render.tolist(),'voxelVolumeMm3':voxel_mm3,'orientation':'RAS+','layout':'x-fastest (Fortran order); little-endian uint16 signal, uint8 labels','maskUrl':mask_url,'surfaceUrl':surface_url,'sequences':sequences,'classes':classes,'surfaces':surface_report,'files':files,'confidence':None,'contextNote':'Context surface follows the nonzero support of the skull-stripped MRI. It is not a labeled cortical segmentation.','annotationNote':'Reference segmentation distributed with MSD/BraTS. This viewer does not run AI inference, establish a diagnosis, or assess segmentation confidence.','processingSeconds':round(time.perf_counter()-start,3)}
(ROOT/'data/imaging/case.json').write_text(json.dumps(manifest,indent=2)+'\n')
(ROOT/'data/imaging/dataset.json').write_text(json.dumps({k:v for k,v in dataset.items() if k not in ['training','test']},indent=2)+'\n')
print(json.dumps({'case':source['case'],'shape':dims,'spacing':manifest['spacingMm'],'classes':classes,'bytes':sum(x['bytes'] for x in files.values()),'triangles':sum(x['triangles'] for x in surface_report.values()),'seconds':manifest['processingSeconds']},default=int,indent=2))
