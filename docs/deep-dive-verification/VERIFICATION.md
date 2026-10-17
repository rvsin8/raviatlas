# RxAtlas Phase 1 verification — 2026-10-03

Result: production build passes; software WebGL 2 verified; 44 requested screenshots plus 4 Follow-the-blood screenshots captured. No browser exceptions in either test suite.

| Check | Result |
|---|---|
| Classification | 19 tests passed: Stanford, DeBakey, arch-only and retrograde patterns |
| URL state | 4 tests passed; browser reload restored Type B on desktop and mobile |
| Wall normals | 1 test passed: outer normals face out; inner normals face the lumen |
| Source registration | Bounds deviation <0.683 mm; continuous 321-sample centerline |
| Click/tap | Real vessel raycast placed an entry tear on desktop and touch viewport |
| Follow the blood | Five territories; normal and compromised labels; three Type A overlays |
| Entry points | Heart card link and search navigation; theme retained |
| Pause | 0 extra frames over 2.5 seconds, both viewport sizes |
| Software FPS, 220 particles | Desktop 3.80; mobile viewport 4.00 |
| Existing app | Body viewer, theme, clinical data, molecule viewer and store unchanged |

Software renderer: ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver). These figures describe SwiftShader, not physical phone performance. Mid-range-phone smoothness remains unverified.

## Model assets

- `aorta.glb`: 728,184 bytes
- `context.glb`: 2,458,260 bytes
- `aorta.json`: 62,317 bytes

## Review limits

Basics content and derived anatomy remain pending human review. The root is the proximal ascending-aorta surface, not a separately sourced root mesh. Pericardial blood is a labeled schematic overlay around real heart geometry; no sac mesh was invented. Flow, wall thickness and perfusion are qualitative illustrations, not a clinical prediction. Detailed and Clinical remain “Coming next” as requested.

[Implementation, provenance and reproduction steps](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/IMPLEMENTATION.md)

## Screenshot gallery

Each requested case is linked below in all four theme/viewport combinations.

| View | Desktop light | Desktop dark | Mobile light | Mobile dark |
|---|---|---|---|---|
| landing | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-landing.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-landing.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-landing.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-landing.png) |
| root | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-root.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-root.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-root.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-root.png) |
| ascending | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-ascending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-ascending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-ascending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-ascending.png) |
| arch | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-arch.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-arch.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-arch.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-arch.png) |
| descending | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-descending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-descending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-descending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-descending.png) |
| abdominal | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-abdominal.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-abdominal.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-abdominal.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-abdominal.png) |
| type-a | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-type-a.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-type-a.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-type-a.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-type-a.png) |
| type-b | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-type-b.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-type-b.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-type-b.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-type-b.png) |
| cross-arch | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-cross-arch.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-cross-arch.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-cross-arch.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-cross-arch.png) |
| cross-descending | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-cross-descending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-cross-descending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-cross-descending.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-cross-descending.png) |
| arch-only | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-light-arch-only.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-dark-arch-only.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-light-arch-only.png) | [View](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-dark-arch-only.png) |

Follow-the-blood captures:
- [desktop: normal](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-follow-normal.png)
- [desktop: dissection](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/desktop-follow-dissection.png)
- [mobile: normal](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-follow-normal.png)
- [mobile: dissection](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/deep-dive-verification/mobile-follow-dissection.png)
