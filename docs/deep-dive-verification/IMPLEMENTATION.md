# Aortic dissection deep dive — Phase 1

Route: `/deep-dive/aortic-dissection/`. The existing body viewer, clinical catalog, molecule viewer, theme, and store are unchanged. The only existing UI changes are entry links in Chest/Heart and the condition component, plus a MiniSearch result. The current catalog has no aortic-dissection condition record; the region panel supplies an educational aortic-dissection card without changing that catalog.

## Anatomy and provenance

- Source: registered BodyParts3D anatomy already used by RxAtlas. Extraction retains the existing world coordinates, with no per-part centering, scaling, or normalization.
- Ascending aorta: FJ3413 / FMA3736; arch: FJ3411 / FMA3768; descending thoracic: FJ1931 / FMA87217; abdominal: FJ1932 / FMA3789.
- Nine named branch meshes: brachiocephalic, left common carotid, left subclavian, celiac, SMA, two renal, and two common iliac arteries. Additional real axillary/brachial, carotid, subclavian, external iliac/femoral, coronary, and aortic-valve geometry provides context and flow routes.
- No separate aortic-root mesh was available in this source asset. The root control identifies the proximal ascending-aorta surface. Its boundary requires anatomical review.
- No separate pericardial-sac surface was supplied. The optional tamponade effect uses blood tracers around the real heart surface and is explicitly labeled schematic. It does not fabricate a sac mesh.
- Centerline: triangle/plane intersections, centroid extraction and cubic smoothing. Wall thickness, layers, tear, flap and lumen surfaces are procedural educational illustrations derived along that path. They are not patient-specific reconstructions.
- The lighter ghost context has 498,359 triangles. The vascular source asset has 35,604 triangles. Ghost bounds remain within 0.683 mm of the full source bounds.
- Existing footer attribution applies: BodyParts3D © DBCLS, CC BY 4.0 (license updated 2025-02-27); source model releases 4.0 and 4.3. The extracted aortic structures are from 4.0.

## Interaction and state

Five selectable segments, mesh-raycast tear placement, distal extent stops, Type A/B presets, play/pause, qualitative pressure and rate, speed, a moving clipping section, and reset. All controls serialize to the route query and restore on reload. Manual orbit and zoom remain available. Reduced-motion preferences skip camera/fade transitions.

The cross-section diagram labels intima, media, adventitia, flap and both lumens. Follow-the-blood mode shows five perfusion territories on real meshes. Flow tracers are GPU-instanced and capped at 220; tracers can remain visible through the wall for teaching. Perfusion changes are illustrative possible compromise, not evidence that every reached branch is obstructed. Optional Type A effects illustrate pericardial blood, reverse valve flow, and coronary involvement.

The canvas uses demand rendering; active playback, interaction and transitions request frames. Paused, settled views render no additional frames.

## Classification and review

Stanford classification uses ascending-aortic involvement. Classic DeBakey categories are computed separately. Arch-only cases show **Non-A non-B (arch involvement)** and remain unclassified by classic DeBakey. The app does not falsely equate that descriptive label with formal SVS/STS reporting, which separately uses entry-tear location and zones. Phase 1 propagates distally; tests also cover retrograde patterns for the pure classifier.

All Basics content is marked `_review: "pending"`. Detailed and Clinical are explicit “Coming next” states. No dosing or treatment targets are included. The anatomy boundaries, derived centerline, illustrative flow model and educational text require human review before a clinical/public launch.

Sources:
- [2022 ACC/AHA Guideline for the Diagnosis and Management of Aortic Disease](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106)
- [SVS/STS reporting standards for type B aortic dissections (2020)](https://www.sts.org/sites/default/files/documents/STS-SVS-ReportingStandardsTypeBAorticDissections.pdf)

## Reproduce

Model build requires Node dependencies from this project, Python 3, NumPy and SciPy:

```sh
bash scripts/build-aortic-deep-dive
node scripts/deep-dive/verify-geometry.mjs
node scripts/deep-dive/classification.test.mjs
node scripts/deep-dive/state.test.mjs
node scripts/deep-dive/wall.test.mjs
npm run build
```

Browser scripts require Playwright and `@sparticuz/chromium`. Set `PLAYWRIGHT_MODULE` to an installed Playwright module when it is outside the project, and optionally `CHROMIUM_EXECUTABLE` to the software-capable Chromium binary. Both scripts start their own static server and use SwiftShader flags.

```sh
node scripts/deep-dive/browser-interactions.cjs
node scripts/deep-dive/browser-verify.cjs
```

The scripts use an emulated phone viewport and touch events, not physical phone hardware. Check orbit/pinch, tap-to-place, sheet dragging, and sustained playback on a real laptop and mid-range phone before claiming hardware performance.
