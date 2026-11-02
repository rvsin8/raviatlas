# RxAtlas continuation — 2026-11-01

Baseline: authoritative Sites source `126eac568c6340d0ab6c932fd955393ffb6c415e`, hosted version 14. The previous 88-test summary was stale: the baseline has 95 passing regression tests and Phase 6 loader/renderer changes.

## Changes in this release

- After any failed volume transfer/integrity/decode attempt, Retry refreshes the browser HTTP cache (`cache: reload`). Concurrent retries still share one promise, verified decoded data remains cached, and all hashes/dimension checks remain mandatory. Previously, a corrupted HTTP-cached response could be returned repeatedly by `force-cache` despite the decoded-cache eviction.
- Insecure HTTP contexts receive a specific HTTPS requirement before attempting MRI downloads. No integrity check is weakened. The prior generic "current browser" message incorrectly suggested upgrading would solve a secure-context restriction.
- An unloaded/failed/changing MRI no longer reports an unverified cursor label as "Unlabeled background". It explicitly says that the cursor label is unavailable.
- MRI view parameters survive Brain anatomy/Conditions/Treatments URLs and full reloads. Previously they were serialized only on the imaging tab, so reloading treatment context silently reset the selected sequence, crosshairs, display controls, and finding on return.

## Verification performed

- 98 Node regression tests pass (95 existing + HTTP-cache recovery, insecure-context rejection, and cross-tab/reload view persistence).
- TypeScript check passes.
- Browser interaction on the supported managed preview: body → head → brain → Brain Explorer → Imaging; checked explicit HTTPS fallback and unavailable cursor label; changed sequence to FLAIR and enabled comparison; navigated to tumor treatment, reloaded, and returned to MRI with `sequence=flair` and `compare=1` retained.
- Static production build is checked separately from browser acceptance. The inherited postbuild hook automatically started a legacy browser harness; it was interrupted, its generated evidence was discarded, and it is not counted as acceptance. Browser checks now have an explicit `npm run verify:browser` entry point that refuses managed execution. All 98 non-browser regression tests still run in prebuild.
- Production build result is recorded in the release tool output.

## Outstanding verification — do not mark complete

The supported managed preview runs at `http://terminal.local:4173/`, which is not a secure context. Web Crypto is therefore unavailable for the required MRI integrity checks. The cloud browser also reports no WebGL 2 capability. The supported navigation checks did not bypass these restrictions; the inherited legacy postbuild attempt described above was discarded. The live private site presents a sign-in gate in this browser.

This verifies fallback/navigation behavior, not successful slice rendering, 3D surfaces, context-loss recovery, mobile layout, pixel differences, or actual M3/phone FPS. Full Phase 7 visual acceptance remains open. Re-run the supplied local browser acceptance harness in an appropriate secure/localhost graphics-capable environment and inspect the results; the harness has not been run here.

## Next additions: evidence and implementation gates

1. Introduce explicit case identity and a registry that binds each case's scan, label mask, affine, source hashes, classes, measurements, surfaces, and explanation set. Unknown/unavailable case IDs must show an unavailable state rather than the glioma scan. Switching cases must reset incompatible voxel/sequence/class/guide state and use a bounded cache. The current runtime remains single-case and imports `data/imaging/case.json` throughout; do not call it multi-case ready.
2. Stroke: the official ATLAS page currently lists R3.0, and requires individual application review plus a decryption code after Terms of Use acceptance. Access is not equivalent to permission to redistribute source or derived assets. Verify the applicable terms before bundling a case. Preserve chronicity metadata; do not describe a structural T1 lesion as an acute diffusion/perfusion study.
   Source: https://fcon_1000.projects.nitrc.org/indi/retro/atlas.html (read 2026-11-01).
3. MS: MSLesSeg is a concrete candidate. Its authors describe T1/T2/FLAIR scans and expert-validated lesion annotations, released under CC BY 4.0. Dataset DOI: https://doi.org/10.6084/m9.figshare.27919209 . Primary publication: https://pmc.ncbi.nlm.nih.gov/articles/PMC12126551/ . Still required: download one paired case from the official release, record exact release/file hashes, verify mask/scan affine and dimensions, calculate calibrated measurements, extract and inspect surfaces, and author case-specific sourced explanations. No scan was imported in this release.
4. Run same-case registration checks and the full browser acceptance journey for each new case before enabling it. Keep medical review pending until qualified review occurs.

No new disease scan, inference model, confidence map, diagnosis, or treatment recommendation was added. Existing clinical text, anatomical assets, MRI/mask files, and surface geometry were preserved.
