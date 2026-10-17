# Female reference body integration

Added the official HRA united-female v1.10 model, its own mesh-name hotspot map and bounding boxes, and a Female / Male control. URL body state overrides a remembered local preference; blocked localStorage falls back safely. Body-only switching does not reset the camera or skin setting. Loading keeps the previous body visible, followed by a 400 ms crossfade (reduced motion skips the animation). Shared selections remain; incompatible selections clear with a note.

The common tissue palette is resolved from the existing theme. Male prostate/testes use exact triangle subsets from existing source identities. Both models use real geometry for picking; no replacement anatomy was created.

Female GLB: **9,693,304 bytes**, **2,187,930 triangles**. Male GLB: **11,197,332 bytes**, unchanged SHA-256. Common height/base alignment is within 1 mm. The wider female arm pose remains anatomically unwarped; use Reset camera to fit the active reference after switching at a close zoom.

All 123 conditions now carry sex applicability and source arrays; 122 are available on the female reference and 121 on the male reference. All 56 drugs and all pre-existing molecule files remain present. Existing symptoms, summaries, treatment lists and mechanisms were preserved. New optional sourced content: a migraine sex-difference callout and lisinopril pregnancy/lactation label summaries. Optional fields are not a complete clinical review and all new summaries are pending human verification.

## Coverage limitations

The HRA set has real breast, uterus, ovaries and fallopian tubes, but partial internal anatomy. Female regions with no separate meshes: ears, nose & sinuses, jaw, face, thyroid gland, esophagus, diaphragm, stomach, arm/shoulder/upper arm/elbow/forearm, hand/wrist/palm/fingers & thumb, calf, foot/ankle/heel/arch/toes. These remain text-accessible and are marked “3D unavailable.” Prostate and testes are male-only. No male geometry is borrowed into the female set. The real female skin shell remains separately toggleable.

## Verification

- Production static build and TypeScript checks pass.
- 62 unit/state tests pass, including 8 new body preference, URL, search, filtering, heatmap and availability tests.
- The exported female GLB is decoded with the same Three.js / Meshopt path as the viewer. Every hotspot mesh name resolves; splitting the male geometry conserves all triangles; female-specific meshes are present; thyroid cartilage is not mapped as thyroid gland.
- Existing male reconstruction and molecular-data checks pass.
- Demos, deep-dive components, molecule components and assets, and the original male binary pass preservation checks against the published source checkpoint.
- **Browser/WebGL visual QA was not performed:** this managed environment does not expose the supported browser-preview capability. No screenshot, FPS, crossfade pixel-diff, or mobile visual results are claimed.

Recommended on-device review: switch Female/Male after orbiting and with skin on/off; open breast/uterus and then switch to Male; search prostate from Female; reload a female deep link; verify the toggle above the canvas on a phone, smooth fading and accurate picking.

Source/license and adaptation details are in CREDITS.md and data/model-reports/female-build.json. Numeric output is in data/model-reports/body-switch-verification.json.
