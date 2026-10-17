"""Optional Blender audit. Not executed in the hosted authoring environment.
Run build.mjs --blender-input first. Candidate exports never overwrite validated originals.
blender -b --factory-startup --python-exit-code 1 -P scripts/organs/blender-audit.py -- heart
"""
import bpy,sys,json
from pathlib import Path
root=Path(__file__).resolve().parents[2];organ=sys.argv[sys.argv.index('--')+1];assert organ in ('heart','brain')
source=root/f'.model-build/organs/{organ}-uncompressed.glb';assert source.exists()
bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(source))
report=[]
for o in bpy.context.scene.objects:
 if o.type!='MESH':continue
 o.data.calc_loop_triangles()
 for p in o.data.polygons:p.use_smooth=True
 report.append({'name':o.name,'triangles':len(o.data.loop_triangles),'worldBounds':[list(o.matrix_world@v.co) for v in o.data.vertices],'sourceProperties':dict(o.items())})
dest=root/'.model-build/organs';(dest/f'{organ}-blender-audit.json').write_text(json.dumps({'blender':bpy.app.version_string,'objects':report,'clinicalValidation':'pending'},default=str))
bpy.ops.export_scene.gltf(filepath=str(dest/f'{organ}-blender-candidate.glb'),export_format='GLB',export_extras=True)
