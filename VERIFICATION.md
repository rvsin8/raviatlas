# RxAtlas fix-pass verification

## Build and model

GLB: 9,232,268 bytes (9.23 MB); 1,417,215 triangles. GLB + HDR: 10,912,502 bytes. Simplification error 0.001; vertex normals recomputed after simplification; flat shading disabled.

Thyroid parent FMA9603 consists of FJ3670 + FJ3671 + FJ3672. The shared thyroid-cartilage reference has 0.0 mm bounding-box difference between releases. The gland uses the same coordinate normalization without hand placement.

## Mapping review

Automatically mapped: 1198. Override mapped: 533. Still unmapped: 506. Mapped counts include intentionally excluded small structures. Rendered parts: 1234; mapped but excluded: 497.

| Likely region for unresolved parts | Count |
|---|---:|
| head | 174 |
| foot | 34 |
| leg | 58 |
| arm | 96 |
| abdomen | 35 |
| pelvis | 28 |
| chest | 52 |
| hand | 24 |
| neck | 2 |
| back | 3 |

Likely regions are spatial review suggestions, not validated anatomy assignments. All unresolved parts have pending records in mesh-overrides.json. No geometry is invented.

## Condition coverage

75 new entries; 121 total. All 47 sub-regions have at least two entries across modes. New entries carry pending human review and MedlinePlus source links. Counts below count a multi-region condition in each linked region.

| Region | Added | Total |
|---|---:|---:|
| Brain | 3 | 5 |
| Eyes | 2 | 3 |
| Ears | 2 | 3 |
| Nose & sinuses | 2 | 3 |
| Mouth & teeth | 2 | 3 |
| Jaw (TMJ) | 2 | 3 |
| Face | 2 | 3 |
| Throat | 1 | 2 |
| Larynx | 2 | 2 |
| Thyroid | 2 | 3 |
| Cervical spine | 1 | 2 |
| Heart | 2 | 3 |
| Lungs | 1 | 3 |
| Breast | 3 | 3 |
| Ribs & sternum | 1 | 2 |
| Esophagus | 2 | 3 |
| Diaphragm | 2 | 2 |
| Stomach | 3 | 4 |
| Liver & gallbladder | 4 | 4 |
| Pancreas | 2 | 3 |
| Intestines | 0 | 3 |
| Kidneys | 2 | 2 |
| Spleen | 2 | 2 |
| Appendix | 2 | 2 |
| Bladder | 0 | 2 |
| Reproductive organs | 0 | 2 |
| Rectum & anus | 2 | 3 |
| Thoracic spine | 2 | 2 |
| Lumbar spine | 2 | 3 |
| Spinal cord | 2 | 2 |
| Sacrum & tailbone | 2 | 2 |
| Shoulder | 2 | 3 |
| Upper arm | 2 | 2 |
| Elbow | 1 | 2 |
| Forearm | 1 | 2 |
| Wrist | 0 | 2 |
| Palm | 2 | 2 |
| Fingers & thumb | 1 | 3 |
| Hip | 3 | 3 |
| Thigh | 1 | 2 |
| Knee | 2 | 4 |
| Shin | 1 | 2 |
| Calf | 2 | 2 |
| Ankle | 2 | 3 |
| Heel | 2 | 3 |
| Arch | 1 | 2 |
| Toes | 2 | 3 |
| Skin | 2 | 7 |
| Whole body / Systemic | 0 | 6 |

## Geometry coverage limitations

Breast is the only named region without dedicated geometry. Its locator highlights pectoralis-major surfaces. Female reproductive anatomy (uterus, ovaries, uterine tubes, cervix and vagina) is absent within the combined reproductive-organs region; these are not separate v1 region IDs. Female-specific conditions show the pelvic locator. Systemic intentionally has no mesh. Elbow is represented by the paired anconeus muscles, not a complete elbow-joint reconstruction.

## License

BodyParts3D © DBCLS, CC BY 4.0 (license updated 2025-02-27). Releases 4.0 and 4.3. Official statement: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html. See CREDITS.md for historical header notices and full attribution.

## Browser verification limitation

The test browser reports WebGL 2 unavailable. Anatomy appearance, no-shell rendering, transparency sorting, camera clipping, 3D tap targets, GPU load time and idle rendering cannot be visually certified here. No simulated or generated anatomy screenshots are presented as browser proof.

## Laptop and phone checklist

- Capture full body, Abdomen, Heart, Knee and Thyroid; each selected region must remain centered and wholly framed. Check Back and breadcrumbs.
- Toggle skin off/on and switch dark mode. Confirm no green highlight shell, smooth surfaces, thin outlines, and surrounding meshes visible at 35% opacity.
- Open Breast and a female-specific reproductive condition: confirm locator plus disclosure, with ordinary conditions and drugs.
- Test hover on desktop; on phone confirm first tap previews and second tap/Open selects. Search a drug, switch modes, use systemic, and reload a deep link.
- In DevTools Network, record an uncached GLB/HDR load. After motion settles, canvas data-frames must remain unchanged across two readings several seconds apart; it must advance during orbit. Record phone frame timing.

## Checks completed in this pass

- TypeScript check passed; static relationships validated for 121 conditions, 49 drugs and 59 region records.
- Meshopt GLB decoded successfully; real anatomy has finite coordinates, valid indices, expected material modes and mapped node IDs.
- All 47 sub-regions meet the two-condition minimum. All 75 new condition records have pending-review metadata and source links. Two broken source URLs were replaced with verified MedlinePlus encyclopedia links.
- Browser: direct Breast search and selection passed; Injury empty state points to Disease (2) and Disorder (1); reload restored the region, mode and dark theme.
- Screenshot `docs/verification-webgl-unavailable.jpg` records the actual fallback interface. It is not anatomy-rendering evidence.
