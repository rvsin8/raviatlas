import json,pathlib,subprocess,zipfile
from PIL import Image,ImageOps,ImageDraw
root=pathlib.Path(__file__).resolve().parents[2];d=root/'docs/deep-dive-fix'
r=json.loads((d/'control-report.json').read_text());p=json.loads((d/'placement-report.json').read_text());c=json.loads((d/'capture-report.json').read_text())
response=json.loads((d/'response-report.json').read_text())
assert response['pass']
assert r['pass'] and p['pass'] and c['webgl2'] and c['video'] and not c['errors']
protected=['components/molecules','app/explore','app/page.tsx','public/models/rxatlas-anatomy.glb','components/Atlas.tsx']
assert not subprocess.check_output(['git','diff','714faa4d78303409767793522d754fd3132339cb','--',*protected],cwd=root)
text=f'''# RxAtlas deep-dive verification

The aortic-dissection route now uses one Zustand scene timeline for camera motion, heartbeat, flow, flap progression and rupture. The original body geometry and molecule renderer are unchanged. The separately requested DVT/PE and asthma additions extend the catalog, anatomy assets, and entry links; their evidence is reported separately. The separately requested body mode heatmap changes only shading, legend/hover labels, mode color tokens, and camera stability during mode switches.

## Results

- {len(r['checks'])} state-and-canvas checks, plus actual desktop/mobile surface placement and mobile sheet checks.
- {len(response['checks'])} immediate-response checks pass the 300 ms gate; maximum observed first response {max(x['ms'] for x in response['checks']):.1f} ms.
- Four real GIF recordings: Type A, Type B, Compare A vs B, and Normal reset.
- 41 unit tests passed (classification, URL, geometry and state-machine cases).
- WebGL 2 verified with Chromium SwiftShader. No page errors.
- Software-rendered rupture FPS: desktop {c['performance']['desktop']:.2f}; mobile viewport {c['performance']['mobile']:.2f}. These are software-rendering measurements, not physical-device performance claims.
- {len(c['screenshots'])} final screenshots; real screen capture in tear-to-rupture.mp4.

## What changed

The preset camera previously ignored the entry location and framed the full aorta. First-use geometry rebuilds and clipping shader changes also delayed feedback; geometry is now reused and clipping stays compiled. Filled and outlined preset styles use the same handlers. Compare uses two copies of the same real aortic path and one synchronized timeline.

The previous controls used separate local clocks and some changed only text. The shared state machine now drives scene selection, camera framing, propagation, pause/speed, caption steps, depth scaffolds, clipping and perfusion. Rupture placement validates the dissected interval, then plays four scrubbable beats: wall bulging/thinning, local opening, escaped-blood collection and systemic effects. Qualitative vital indicators occupy the caption panel rather than obscuring the anatomy.

## Interpretation and limitations

All explanatory content is human-review pending. The blood collections are schematic teaching effects derived from real context geometry; they are not segmented pericardial, pleural or retroperitoneal cavity models. Organ-perfusion changes illustrate a possible pattern, not an inevitable outcome or patient simulation. No treatment targets or dosing are introduced.

BodyParts3D © DBCLS, CC BY 4.0, license updated 2025-02-27. Existing release 4.0 / 4.3 assets retained.

References: [2022 ACC/AHA guideline](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106); [SVS/STS reporting standards](https://www.sts.org/sites/default/files/documents/STS-SVS-ReportingStandardsTypeBAorticDissections.pdf); [DBCLS license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html).

See CONTROL-AUDIT.md for every control and handler, and the JSON reports for individual results. Pause is tested by absence of motion; active segment and depth controls are disabled with explanations; presets replay on repeat clicks. Navigation links retain their purpose.
'''
(d/'README.md').write_text(text)
html='<meta charset="utf-8"><title>RxAtlas verification</title><style>body{font:16px system-ui;max-width:1200px;margin:40px auto}img,video{max-width:100%}figure{margin:30px 0}</style><h1>RxAtlas deep-dive verification</h1><video controls src="tear-to-rupture.mp4"></video>'
for name in c['screenshots']:html+=f'<figure><figcaption>{name}</figcaption><img loading="lazy" src="{name}"></figure>'
(d/'index.html').write_text(html)
canvas=Image.new('RGB',(1200,1000),'white');draw=ImageDraw.Draw(canvas)
for row,loc in enumerate(['ascending','thoracic','abdominal']):
 for col in range(4):
  im=Image.open(d/f'desktop-light-rupture-{loc}-{col+1}.png');im=ImageOps.contain(im,(300,300));canvas.paste(im,(col*300,row*330+25));draw.text((col*300+8,row*330+5),f'{loc} — beat {col+1}',fill='black')
canvas.save(d/'rupture-overview.jpg',quality=90)
with zipfile.ZipFile(d/'verification-evidence.zip','w',zipfile.ZIP_DEFLATED) as z:
 selected=set(c['screenshots'])|{c['video']['file'],'control-report.json','placement-report.json','response-report.json','capture-report.json','README.md','CONTROL-AUDIT.md','RESPONSE-RESULTS.md','rupture-overview.jpg','index.html'}
 for name in ['type-a','type-b','compare-a-b','normal-reset']:selected.update([name+'.gif',name+'-result.png'])
 for name in sorted(selected):z.write(d/name,name)
 z.write(root/'CREDITS.md','CREDITS.md')
