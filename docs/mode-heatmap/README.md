# RxAtlas mode heatmap

Real anatomy geometry is unchanged. The heatmap reads the current catalog, including the separately requested DVT/PE and asthma entries. Material colors are desaturated 70%; the existing meshes receive count-based emissive tint and a Fresnel rim. No shell or overlay mesh is added. A 0.6-second head-to-foot sweep changes modes without moving the camera. Selection retains its orange outline.

| Mode | Body-mapped conditions | Regions |
|---|---:|---:|
| Disease | 54 | 32 |
| Disorder | 32 | 28 |
| Injury | 32 | 25 |

Systemic-only conditions remain in their separate drawer and are excluded from the body legend.

Intensity: 0 conditions = 0; 1–4 = 0.07, 0.14, 0.21, 0.28; 5+ = 0.35. The shader adds a subtle angle-dependent rim to that strength.

Verification: software WebGL 2; all six full-body light/dark mode checks change canvas pixels; every region and mesh intensity matches independent counts from the source JSON; camera position and rotation stay fixed; Leg uses sub-region counts; the canvas idles after the sweep. See verification.json for measured results.
