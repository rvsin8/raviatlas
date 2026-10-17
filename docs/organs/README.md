# Organ and imaging explorer implementation

## Phase 0 audit

Work began from the **published Site version 10**, source commit `0e139f46319288686a507923a4c7dcb6cc5c82f4`, not the older GitHub reconstruction. The local and GitHub feature branch is `feature/heart-brain-explorers`. See `audit.json` for exact protected asset hashes and catalog counts.

| Capability | Published baseline | This implementation |
|---|---|---|
| Male/female map, modes, skin, search, molecules, catalog | Present | Preserved; source/asset equality checked |
| Aortic, DVT/PE and asthma exhibits, demo routes | Present | Preserved |
| Heart/Brain overlay | Not published | Shared lazy R3F viewer, URL state, selection, layers, conditions, treatment links |
| Detailed organ geometry | Existing real parts in body | Source-tagged extracts: heart 585,072 bytes / 90,276 triangles; brain 1,068,060 bytes / 194,024 triangles |
| MRI workspace and tumor segmentation | Missing | One registered MSD case, linked slices, same-case surfaces, annotated findings |
| AI inference / diagnostic report | Missing | Deliberately not implemented; explanations are curated and annotation-grounded |
| Expert medical validation | Not established | Pending; not claimed |

## Navigation and architecture

The body remains mounted under an inert modal. CameraControls state, body, skin, mode, region, and scroll are restored when the modal closes. Escape, a focus trap, focus return, touch controls and explicit structure buttons are supported. Shared registry: `data/organs/registry.json`; shared overlay: `components/organs/OrganExplorer.tsx`; reusable canvas: `OrganCanvas.tsx`.

Examples:

* `/explore/?body=female&organ=heart`
* `/explore/?body=male&organ=brain&structure=hippocampus`
* `/explore/?body=female&organ=brain&organTab=imaging&finding=3&voxel=78,141,49`

The two body choices currently open the same explicitly labeled adult male BodyParts3D reference organ extracts. They are not falsely described as female-specific detailed organs. Source FMA IDs and source-part IDs remain in the registry and mesh extras.

## Anatomy pipeline and supported animations

`python scripts/organs/registry.py`, then `node scripts/organs/build.mjs` extracts original source triangles, retains world coordinates, welds and Meshopt-compresses them. `node scripts/organs/verify-assets.mjs` checks every exported vertex against its source part bounds, mesh metadata, triangle counts, and asset sizes.

Heart cycle motion is a small schematic deformation, not a measured cardiac simulation. Circulation is a sequential highlight with directional captions in physiological order. There is no invented particle centerline. Valve movement, separately identified septum, validated cut sections and cerebral-vessel flow remain unavailable with explicit reasons. Chamber cavity boundaries are labeled as such. Neural signaling is a separate conceptual diagram, not an activation map. Alzheimer microscopic concepts are separate symbolic diagrams, not large plaques on the brain surface.

Blender/Scenario were reviewed but **could not execute here**. No paid API was called and no Blender-created asset is claimed. Optional workflow: `node scripts/organs/build.mjs --blender-input`, then `blender -b --factory-startup --python-exit-code 1 -P scripts/organs/blender-audit.py -- heart` (or `brain`). The script exports an audit candidate separately; it never overwrites the source or validated extraction. Expert review of labels, topology and vessel relationships remains outstanding.

## Real MRI demonstration

Case **BRATS_457**, Medical Segmentation Decathlon Task01 BrainTumour, release **2.0 04/05/2018**, **CC BY-SA 4.0**. `data/imaging/case.json` records original archive members, SHA-256 hashes, affine matrices, dimensions, voxel spacing, label names, calibration, asset hashes and sources. `public/imaging/msd-brain/LICENSE.txt` applies to derived imaging assets. See CREDITS for required BraTS citations.

The source manifest's class mapping is authoritative: **1 edema; 2 non-enhancing tumor; 3 enhancing tumor**. These are MSD IDs, not the original BraTS numerical IDs. The original reference masks are unchanged. The small class-2 mask in this case contains 47 voxels; it is not enlarged to make a more dramatic illustration.

The data are public skull-stripped research images with a pseudonymous case ID. The site exports voxel values and derived surfaces, not original NIfTI headers, patient names or clinical records. No patient upload, storage, diagnostic inference, confidence score or report generator is implemented.

### Rebuild

Install Python `nibabel`, `numpy`, `scipy`, `scikit-image` and optionally `matplotlib` for figures.

1. `python scripts/imaging/fetch-case.py` retrieves a paired case using HTTP ranges from the official MONAI/MSD archive. It caches a TAR index and the original files in ignored `.model-build/imaging/`. The tail optimization is specific to this documented archive release; changed archives must be audited, not silently substituted.
2. `python scripts/imaging/preprocess.py` verifies paired affines and shapes, reorients both to RAS+, exports two 16-bit signal volumes and the unchanged uint8 mask, and extracts real mask surfaces with marching cubes. Browser assets total **7,728,923 bytes**, **123,274 triangles** including MRI-support context. Initial T1 + mask + surfaces is **5,037,451 bytes**; FLAIR loads only on selection.
3. `python scripts/imaging/verify.py` verifies hashes, counts, physical coordinates, native mask equality, quantization error and registration of all surface vertices. Results are in `data/imaging/verification.json`.

Phase 2 adds reliable source-label picking and shareable camera focus; see `phase-2.md`.

Browser storage is x-fastest, little-endian. All three slice planes, mesh coordinates and the linked cursor share one matrix: `scene = [R, S, -A] / 1000` after the NIfTI voxel-to-RAS affine. There is no per-part centering, mask stretching, registration to unrelated anatomy, or inferred lobe labeling. Radio­logical display puts patient right on the left; sagittal anterior is on the left. Window/level changes display contrast only. MRI values are relative signal, not Hounsfield units.

Volumes use native labeled voxel counts multiplied by the absolute affine determinant, then mm³ → mL. They do not use a simplified surface estimate:

| Dataset class | Native voxels | Volume |
|---|---:|---:|
| Edema | 70,526 | 70.526 mL |
| Non-enhancing tumor | 47 | 0.047 mL |
| Enhancing tumor | 3,218 | 3.218 mL |

The faint context mesh is the nonzero image-support surface, not a validated cortical segmentation. Display signal is quantized with a bounded error; masks are lossless. No uncertainty map is provided. The explanation panel says exactly what is known and links to the dataset and medical references. Stroke, Alzheimer and MS open existing educational condition/treatment context; no unsupported imaging cases are invented. Tumor treatment context links to NCI, since no tumor-specific drug record exists in the current catalog.

## Verification and limitations

* **82 state/unit tests passed**: existing body, heatmap and clinical deep-dive state checks plus new organ and imaging tests.
* **31 imaging checks passed**, including native mask equality and all physical mesh coordinates.
* Organ source-bound checks passed. Protected male/female assets, conditions, drugs, molecules, theme and existing deep-dive components remain unchanged.
* Production build/typecheck results are recorded at release.
* Browser interaction tests, screenshots, FPS, first-render timing and real mobile performance **were not run**: managed browser preview capability is unavailable. Do not interpret host preprocessing or asset decode timing as rendering FPS.
* `mri-registration-evidence.png` shows actual source slices and masks from preprocessing. It is **not a browser screenshot**.
* On-demand R3F rendering, capped pixel ratio, two-sequence caching, and a 2D-only fallback are implemented. Their real-device performance remains to be measured.

### Required browser acceptance pass

On desktop and phone: open each body, rotate/zoom, enable skin, then open/close both organs and confirm the body state survives. Test keyboard focus, Escape and browser Back; reload each deep link. In Imaging, test every orthogonal slider, crosshair click/drag, arrow/Page keys, zoom, pan, window/level, both sequences, class toggles, opacity endpoints, compare, 3D picking, camera reset, context/planes, fullscreen and 2D fallback. Verify the same labeled focus across all views. Follow condition/treatment links and return. Inspect console and measure network/load/FPS in both themes. Check paused demand canvases stop rendering. Medical review is required before claiming clinical validation.
