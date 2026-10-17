# Body reconstruction verification

Status: reconstruction verification passes with the user-approved source-asymmetry exception (2026-09-28).

## Root cause

The renderer applied world matrices directly to normalized Int16 position attributes from Meshopt quantization. Writing transformed coordinates into those integer buffers clamps/wraps values and distorts the assembled anatomy. Expanding decoded components into Float32 attributes before applying the matrix fixes that corruption. The verifier uses the exact same helper as the renderer.

The old build also used a centered 6.2-unit coordinate system. The rebuilt pipeline now applies only `(x, y, z) mm → (0.001x, 0.001z, −0.001y) m`, including the 4.3 thyroid: no translation, individual centering, or nonuniform anatomical scaling. GLB quantization stores reversible decode matrices; those are encoding metadata, not changes to anatomical registration.

## Changes

- Retain every source part, including all 506 unmapped parts; unmapped meshes render normally without click targets.
- Simplify each part independently (error 0.001, locked borders); recompute smooth normals, then join compatible material primitives without moving vertices.
- Retain per-vertex source IDs for inspection after Meshopt compression.
- Use high-level Meshopt compression and 14-bit position quantization.
- Correct the outline unit mismatch: the old `screenspace` path extruded by 0.45 model units (now metres). Use a 0.75-pixel outline without moving visible anatomy.
- Fit Body and Systemic to the full model bounds, facing front, with 15% padding.
- Run `scripts/verify-body` during both model build and application prebuild. Any failure prevents the build.
- No condition content or unrelated UI features changed.

## Numeric results

GLB: **11,197,332 bytes (11.20 MB)**; **2,553,967 triangles**. All **2,237** source parts are present.

| Check | Result |
|---|---|
| width | 0.665982 m — pass |
| height | 1.729493 m — pass |
| depth | 0.291515 m — pass |
| Feet / head elevation | -0.078083 / 1.651410 m |
| Largest source dimension ratio | 1.063010× — pass (<1.2×) |
| Arm/hand centroid X range | -0.317080 to 0.317390 m — pass |
| Mirror symmetry | PASS with 26 explicitly approved source-asymmetric pairs / 477 pairs |

Surface-area-weighted centroid Y (m): head 1.54810, neck 1.42065, chest 1.19185, abdomen 1.00717, pelvis 0.85879, thigh 0.60949, knee 0.39465, foot -0.04556. Ordering passes.

Feet retain the source origin at −7.8 cm. The verifier reports this explicitly and treats “near” as ±10 cm; no translation was added.

## Approved source asymmetry

The original source is not perfectly mirrored. The verifier compares source and decoded mesh bounds for every pair, so source asymmetry is distinguishable from reconstruction damage. For example:

| Structure | Source mirror difference | Rebuilt mirror difference |
|---|---:|---:|
| pubococcygeus | 3.142 cm | 3.061 cm |
| portal vein | 10.857 cm | 10.856 cm |
| fibular vein | 45.182 cm | 45.185 cm |
| hepatic vein | 5.637 cm | 5.637 cm |
| anterior cusp of pulmonary valve | 5.066 cm | 5.067 cm |
| posterior cusp of aortic valve | 3.984 cm | 3.984 cm |
| medial basal segmental bronchial tree | 8.480 cm | 8.479 cm |
| posterior segmental bronchial tree | 3.337 cm | 3.337 cm |

Making these pairs symmetric would violate the instruction to preserve registered source anatomy. No parts were moved to force a passing result. The user approved these 26 source-asymmetric pairs on 2026-09-28. The exception is pinned to the source-bounds SHA-256 and the exact pair identities. Every other pair retains the 3 cm mirror requirement. Each approved pair must preserve all six signed mirrored bounding-box coordinates within 1 mm; the largest observed deviation is 0.8034 mm. Unlisted asymmetry, changed source data, and introduced deformation still fail verification. No source geometry changed for this exception.

Full output: [verify-body-output.txt](verify-body-output.txt). All 26 pairs: [verify-body.json](../../data/model-reports/verify-body.json).

## Software rendering

Playwright launched Chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader`. WebGL 2 is available; renderer: `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)`.

The front and side screenshots show the complete reconstructed body. Heart, Knee and Head screenshots were retaken after correcting outline units. Screenshots use reduced-motion preference to inspect settled framing. Smooth transition behavior on a physical phone was not performance-tested.

- [Full body, front](front.png)
- [Full body, side](side.png)
- [Heart selected](heart.png)
- [Knee selected](knee.png)
- [Head selected](head.png)

Fresh selected-region sessions restored their URL selections. The development browser logged React/Drei unmount/removeChild errors during loading; the completed anatomy views rendered. These diagnostics are retained in `selected-browser-report.json`; no unrelated UI changes were made to address them.

TypeScript checks passed in the reconstruction pass. The historical strict-gate failure is retained in `strict-build-gate-output.txt`; the updated verifier passes with zero failures. All size, placement, dimension, and source-shape checks remain active.

Idle verification passes: after settling, three samples over 10.0 seconds remain at **4 frames**, last frame at **6.076 seconds**. The local GLB resource completed in **1.018 seconds**. This is a local development/SwiftShader measurement, not a production-network or phone benchmark. See `idle-report.json`.
