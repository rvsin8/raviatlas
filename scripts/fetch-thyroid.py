"""Acquire version-stamped 4.3 thyroid and a shared reference directly from DBCLS."""
from pathlib import Path
import subprocess,zipfile,json
P=Path('public/models/source/4.3');P.mkdir(parents=True,exist_ok=True)
base='https://lifesciencedb.jp/bp3d/'
def curl(*args):subprocess.run(['curl','-fsSL','--max-time','120',*args],check=True)
if not (P/'manifest/FMA2Obj.txt').exists():
 curl(base+'get-info.cgi?version=4.3&cmd=concept-objfiles-list','-o',str(P/'manifest.zip'))
 with zipfile.ZipFile(P/'manifest.zip') as z:z.extractall(P/'manifest')
if not list((P/'thyroid').rglob('FJ3670*.obj')):
 cookie=P/'session.cookies';curl('-c',str(cookie),base,'-o',str(P/'viewer.html'))
 curl('-b',str(cookie),'-e',base,'--data-urlencode','ids=["FJ3670","FJ3671","FJ3672","FJ2808"]','--data-urlencode','rep_id=["BP21406","BP21433","BP19828","BP22917"]','--data-urlencode','type=art_file','--data-urlencode','all_downloads=1','--data-urlencode','filename=thyroid-4.3',base+'download.cgi','-o',str(P/'thyroid.zip'))
 with zipfile.ZipFile(P/'thyroid.zip') as z:z.extractall(P/'thyroid')
 cookie.unlink(missing_ok=True)
manifest=(P/'manifest/FMA2Obj.txt').read_text()
assert 'FMA9603\tpart_of\tFJ3670+FJ3671+FJ3672' in manifest,'Thyroid-gland membership changed: stop for review'
