# Brain imaging: Phases 3–5

Scope: guided annotation explanations, disease/treatment connections, and responsive workspace refinement. Builds on the published Phase 2 registered MSD BRATS_457 case; no new scans, model geometry, or inference system.

## Implemented

- Five-step explanation: locate, compare, measure, context, limits. A single `guideState` patch sets crosshairs, sequence, class visibility, opacity, planes, context, and camera framing. `guide` is shareable URL state. Manual imaging changes end guided mode so the caption cannot describe an outdated view.
- Structured findings show sequence, source-label centroid in calibrated RAS coordinates, imaging feature, native-mask measurement, clinical context, uncertainty, and annotation provenance. These are curated educational explanations, explicitly not AI interpretations or diagnostic reports. New medical text is marked review pending and links primary sources.
- Brain tumors added to the organ condition registry, without inventing tumor anatomy on the unrelated reference brain. Imaging links to brain tumor, ischemic stroke, Alzheimer’s, and MS condition/treatment tabs. Existing catalog references retain their existing navigation. Only the glioma case has enabled imaging; no stroke, Alzheimer’s, or MS scan is substituted.
- Imaging can be reopened from condition/treatment context with its previous registered view state. Main atlas, body selection, skin, existing camera restoration, Heart Explorer, deep dives, pharmacology, and molecule files retain their implementation.
- Responsive section navigation for MRI slices, 3D model, and findings keeps the workspace mounted. Mobile touch targets enlarged; keyboard focus moves to the selected section. Scroll animation respects reduced-motion preferences. Fullscreen is disabled with an explanation when unsupported. MRI loading errors offer a retry. Existing 2D-only fallback, raw/overlay comparison, and reset remain available.
- Dialog description now remains present in both anatomy and imaging modes.

## Verification

- 88 Node tests pass, including all existing body, organ, and three deep-dive state suites, spatial selection tests, and new guide/URL/disease tests.
- New guide tests cover all five steps for all three real segmentation classes, checking each step changes rendered inputs, selects a native labeled voxel, and preserves body/mode/skin settings on URL reload. These are state and data tests, not browser pixel-diff tests.
- TypeScript `tsc --noEmit` passes. Production static build passes.
- No changes to public MRI volumes, masks, surfaces, anatomy models, main catalog, molecules, main canvas components, or existing deep-dive implementation relative to Phase 2 source commit `89a647edeee48e3349dc0563d4395bb23ccb644c`.
- Prior spatial verification remains applicable: 31 checks including native affine agreement, calibrated voxel volumes, physical transforms, hashes, and surface/source agreement. Data and preprocessing did not change in this pass.

## Metrics and limitations

Existing MRI delivery remains 7,728,923 bytes for both sequences, labels, and surfaces; initial T1/label/surface payload is 5,037,451 bytes. Surface count remains 123,274 triangles. These are asset measurements, not runtime performance claims. Load/decode duration is measured in the user's session and shown under source details; it excludes 3D rendering.

Browser QA is unavailable under the managed Sites workflow because the required control-browser skill is absent. No browser screenshots, pixel diffs, interactive mobile verification, or desktop/mobile FPS were obtained. The existing registration figure is preprocessing evidence only. Browser visual/performance sign-off remains outstanding.

No confidence maps, AI inference, lobe localization, diagnostic service, or patient uploads were added. Tumor-specific drug records are absent from the current catalog; treatment context links the NCI overview instead of inventing a medication mapping. Verified imaging cases for stroke, Alzheimer’s, and MS remain unavailable.

## Browser acceptance checklist

1. Open Brain → Imaging on either body; confirm three linked slices and same-case 3D surfaces.
2. Select each class and run all five explanation steps. Reload a guide deep link; confirm state and caption agree.
3. Move crosshairs or adjust display controls while guided; confirm guided mode ends.
4. Follow each disease overview/treatment connection; return to the glioma case. Confirm unsupported disease imaging remains disabled.
5. Test raw/overlay comparison, fullscreen, 2D-only fallback, reset, and mobile section navigation in light/dark themes.
6. Close the explorer and confirm the original body view, filters, skin state, camera, keyboard focus, and scroll position.
7. Record actual browser load time and desktop/mobile frame rates before claiming performance acceptance.
