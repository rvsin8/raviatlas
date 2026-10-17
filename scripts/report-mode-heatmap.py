import json,pathlib,zipfile
from PIL import Image,ImageDraw
root=pathlib.Path(__file__).resolve().parents[1];d=root/'docs/mode-heatmap';r=json.loads((d/'verification.json').read_text());assert r['pass']
conditions=json.loads((root/'data/conditions.json').read_text())['conditions']
lines=[]
for mode in ['disease','disorder','injury']:
 cs=[c for c in conditions if c['mode']==mode and c['regionIds']!=['systemic']]
 ids={i for c in cs for i in c['regionIds'] if i!='systemic'}
 lines.append(f'| {mode.title()} | {len(cs)} | {len(ids)} |')
(d/'README.md').write_text('# RxAtlas mode heatmap\n\nReal anatomy geometry is unchanged. The heatmap reads the current catalog, including the separately requested DVT/PE and asthma entries. Material colors are desaturated 70%; the existing meshes receive count-based emissive tint and a Fresnel rim. No shell or overlay mesh is added. A 0.6-second head-to-foot sweep changes modes without moving the camera. Selection retains its orange outline.\n\n| Mode | Body-mapped conditions | Regions |\n|---|---:|---:|\n'+'\n'.join(lines)+'\n\nSystemic-only conditions remain in their separate drawer and are excluded from the body legend.\n\nIntensity: 0 conditions = 0; 1–4 = 0.07, 0.14, 0.21, 0.28; 5+ = 0.35. The shader adds a subtle angle-dependent rim to that strength.\n\nVerification: software WebGL 2; all six full-body light/dark mode checks change canvas pixels; every region and mesh intensity matches independent counts from the source JSON; camera position and rotation stay fixed; Leg uses sub-region counts; the canvas idles after the sweep. See verification.json for measured results.\n')
canvas=Image.new('RGB',(1920,940),'white');draw=ImageDraw.Draw(canvas)
for row,theme in enumerate(['light','dark']):
 for col,mode in enumerate(['disease','disorder','injury']):
  name=f'full-body-{theme}-{mode}.png';im=Image.open(d/name).convert('RGB');im.thumbnail((640,450));canvas.paste(im,(col*640,row*470+20));draw.text((col*640+8,row*470+4),f'{theme.title()} · {mode.title()}',fill='black')
canvas.save(d/'mode-comparison.jpg',quality=94)
with zipfile.ZipFile(d/'mode-heatmap-evidence.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in d.iterdir():
  if p.suffix in ['.png','.json','.md','.jpg'] and p.name!='debug-ready.png':z.write(p,p.name)
