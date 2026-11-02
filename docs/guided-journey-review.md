# Guided brain MRI journey — 2026-11-02

Baseline: authoritative private Site v17, commit bae729a2dff551c961d5674f074029f94c366655. This remains the rollback checkpoint.

Optional five-step lesson connects reference anatomy, real MRI slices, annotation-grounded explanation, general treatment categories and a three-question reflection. Free exploration remains available. Lesson position lives in the URL; quiz answers are session-component state and reset on reload. No personal tracking added.

## Sources and boundaries
- Existing BRATS_457 MRI and supplied labels: Medical Segmentation Decathlon Task01 BrainTumour, CC BY-SA 4.0; original credits and licensing unchanged. No new dataset or synthetic patient segmentation.
- Existing BodyParts3D reference anatomy is separate from, and not registered to, the case. No lobe assignment supplied.
- New treatment overview and reflection context: https://www.cancer.gov/types/brain/patient/adult-brain-treatment-pdq (reviewed 2026-11-02). App links appear adjacent to content. BraTS annotation and MSD provenance links retained.
- Educational content awaits qualified medical review; no diagnosis, dose, prognosis or individualized treatment recommendation.

## Verification
- TypeScript: pass.
- Imaging, body, organ and deep-dive regression suite: 105 tests pass, zero failures.
- Production static build: pass.
- Supported browser at desktop viewport: all five steps; real 2D MRI slices; locate annotation action; incorrect/correct quiz feedback (2/3 then 3/3); Back/Forward; reload restores step and MRI settings, resets answers; minimize/show; exit keeps FLAIR/2D/crosshairs; manual other-disease navigation exits lesson.
- Responsive CSS is included; physical mobile device and GPU 3D rendering were not validated. No performance certification claimed.
- Preview and production build must run serially because the existing development server and build share .next. Restarted preview after build and verified hydration/reload; final build runs with preview stopped.
