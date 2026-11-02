"""Fetch one official MSD case using HTTP ranges; never download the full archive.
Source: Medical Segmentation Decathlon Task01, CC BY-SA 4.0.
Retains a resumable TAR index and original NIfTI bytes, with SHA-256 provenance.
"""
import urllib.request, json, math, hashlib, time, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DEST=ROOT/'.model-build/imaging'; DEST.mkdir(parents=True,exist_ok=True)
URL='https://msd-for-monai.s3.amazonaws.com/Task01_BrainTumour.tar'
INDEX=DEST/'tar-index.json'; entries=json.loads(INDEX.read_text()) if INDEX.exists() else []
def fetch(start,size):
 for attempt in range(5):
  try:
   data=subprocess.check_output(['curl','--fail','--silent','--show-error','--location','--max-time','90','--range',f'{start}-{start+size-1}',URL])
   if len(data)!=size: raise RuntimeError(f'Incomplete range {len(data)}/{size}')
   return data
  except Exception:
   if attempt==4: raise
   time.sleep(1+attempt)
def save(entry,name):
 path=DEST/name
 if not path.exists(): path.write_bytes(fetch(entry['offset']+512,entry['size']))
 return {'path':name,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'archiveMember':entry['name']}
offset=entries[-1]['next'] if entries else 0
tail_checked=False
case=None
for e in entries:
 if '/imagesTr/' in e['name'] and e['name'].endswith('.nii.gz') and '/._' not in e['name']: case=e['name'].split('/')[-1]; break
while True:
 for e in entries:
  if e['name']=='Task01_BrainTumour/dataset.json': save(e,'dataset.json')
 if case:
  if not tail_checked:
   # This fixed official release places all reference masks at the end.
   # Read the tail once instead of fetching hundreds of image payloads.
   tail_start=7583091712; tail_size=25174528
   tail_path=DEST/'archive-tail.bin'
   if not tail_path.exists():tail_path.write_bytes(fetch(tail_start,tail_size))
   tail=tail_path.read_bytes()
   for off in range(0,len(tail)-512,512):
    h=tail[off:off+512];name=h[:100].split(b'\0')[0]
    if not name.startswith(b'Task01_BrainTumour/labelsTr/') or not name.endswith(b'.nii.gz'):continue
    try:size=int(h[124:136].rstrip(b'\0 '),8);checksum=int(h[148:156].rstrip(b'\0 '),8)
    except ValueError:continue
    if sum(h[:148])+8*32+sum(h[156:])!=checksum:continue
    entries.append({'name':name.decode(),'size':size,'offset':tail_start+off,'next':tail_start+off+512+math.ceil(size/512)*512})
    (DEST/name.decode().split('/')[-1]).write_bytes(tail[off+512:off+512+size])
   INDEX.write_text(json.dumps(entries));tail_checked=True
  image=next((e for e in entries if e['name']==f'Task01_BrainTumour/imagesTr/{case}'),None)
  label=next((e for e in entries if e['name']==f'Task01_BrainTumour/labelsTr/{case}'),None)
  if image and label:
   manifest={'url':URL,'case':case.removesuffix('.nii.gz'),'files':[save(image,'image.nii.gz'),save(label,'labels.nii.gz')]}
   (DEST/'source.json').write_text(json.dumps(manifest,indent=2));print(json.dumps(manifest),flush=True);break
 header=fetch(offset,512)
 if not any(header): raise RuntimeError('End of archive before paired case found')
 name=header[:100].split(b'\0')[0].decode();size=int(header[124:136].rstrip(b'\0 ') or b'0',8)
 entry={'name':name,'size':size,'offset':offset,'next':offset+512+math.ceil(size/512)*512};entries.append(entry);offset=entry['next']
 INDEX.write_text(json.dumps(entries))
 if not case and '/imagesTr/' in name and name.endswith('.nii.gz') and '/._' not in name: case=name.split('/')[-1]
 if len(entries)%50==0 or (case and name.endswith(case)): print(f'{len(entries)} entries, {offset} bytes indexed, case={case}, {name}',flush=True)
