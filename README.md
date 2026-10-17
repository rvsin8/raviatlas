# RxAtlas

Static educational anatomy and pharmacology atlas. Next.js App Router + TypeScript, React Three Fiber / Drei CameraControls, Zustand, Tailwind CSS, Motion, and MiniSearch. No server API, database, accounts, prescribing, or medication dose fields.

## Run and deploy

Node 22+ recommended.

```sh
npm ci
npm run dev
npm run build
```

`npm run build` validates seed references and generates reverse drug → condition → region relationships before Next.js exports into `out/`. Deploy on Vercel with the Next.js preset and static output, or host `out/` on a static host supporting directory index files. The development wrapper accepts either standard use or the supervised preview's host/port flags. The root opens `/explore/` and preserves query parameters.

## Content

121 conditions, 49 drugs, 10 major regions and 47 sub-regions; skin and systemic are separate entries. Left/right structures share IDs. Content is an illustrative seed, not an exhaustive clinical reference. `_review` is first in each source JSON because JSON does not support literal comment syntax. A qualified human must verify every clinical entry, brand/formulation, and indication before public release. Modes are operational teaching categories; they are not universally accepted diagnostic classifications.

Reviewed source starting points:
- https://medlineplus.gov/druginfo/meds/index.html
- https://medlineplus.gov/druginfo/meds/a682159.html (ibuprofen)
- https://medlineplus.gov/druginfo/meds/a682145.html (albuterol)
- https://www.niddk.nih.gov/health-information/digestive-diseases/acid-reflux-ger-gerd-adults/treatment
- https://www.niddk.nih.gov/health-information/digestive-diseases/irritable-bowel-syndrome/treatment
- https://www.niams.nih.gov/health-topics/lupus/diagnosis-treatment-and-steps-to-take
- https://www.niams.nih.gov/health-topics/rheumatoid-arthritis/diagnosis-treatment-and-steps-to-take
- https://www.accessdata.fda.gov/scripts/cder/daf/

Drug associations represent examples, sometimes symptom support, not universal suitability. Human review remains outstanding; no clinical validation is claimed.

## State and navigation

`/explore/?mode=injury&region=knee&condition=acl-tear`

Other parameters: `drug`, `skin=1`, `theme=dark`, `list=1`, `search=1`, `q`, `sheet=open`. Browser Back/Forward restores the same state. Invalid IDs are dropped. A condition URL corrects conflicting mode/region. Hover, tap preview and live manual camera orbit are transient interaction state; selections and sheet state are shareable. Search includes generic and brand names across modes. Choosing a condition selects its own mode; a drug map spans modes.

## Anatomical model pipeline

The model is real BodyParts3D 4.0 geometry plus thyroid gland from release 4.3. See CREDITS.md for attribution, source and licensing. No primitive anatomy or synthetic organ replacement is used.

Run `npm run build:model -- --download` to acquire missing official source files into `public/models/source/` and rebuild. Alternatively download the eight files listed in scripts/prepare-model.py from the official source into that directory, then run `npm run build:model`. Requires Python 3, curl, Node and npm dependencies. Source archives are ignored by git and removed from the static export after build.

The pipeline expands FMA PART-OF/composition mappings, classifies tissue via IS-A, and applies data/mesh-overrides.json. It omits small vessels, tiny muscles and peripheral nerves at region scale; every kept, excluded and unmapped part is recorded in data/model-reports/build-report.json and data/model-unmapped.json. Unmapped anatomy is omitted, never invented. Review those files before anatomical release. The thyroid uses official 4.3 gland meshes with verified shared coordinates. Breast has no dedicated mesh and uses real pectoral surfaces only as a locator. Elbow uses paired anconeus meshes. Female reproductive anatomy is absent; female-specific conditions use a pelvic locator and disclosure.

The export is Y-up, feet at -3, crown at 3.2, front +Z. Each GLB node is a region ID with material primitives. Actual geometry provides separate invisible raycast targets. The renderer preserves quantization transforms, clones materials and uses the same region state as the rest of the app. Replacing the source requires region-ID nodes and the same normalization; regenerate bounds/cameras for different proportions.

Gltf-transform welds, simplifies, deduplicates, prunes and applies Meshopt. The texture compression stage runs but OBJ sources have zero texture images. Final metrics and SHA-256 are in public/models/model-manifest.json. The HDR is served locally. Total GLB + HDR remains below 15 MB.

## Verification and device checks

The available browser has WebGL 2 disabled. UI navigation can be tested here, but real rendering, anatomy screenshots, GPU frame rate, model load time and idle rendering cannot be certified. Run these checks on a laptop with graphics acceleration and a mid-range phone before release:

1. Inspect full body, then Chest → Heart, Leg → Knee, Neck → Larynx; capture each. Check front/back orientation, alignment, occlusion and camera framing.
2. Capture full body with Skin layer off and on. Check translucent skin and opaque interiors.
3. Orbit/zoom, return via breadcrumbs, switch all modes, search a drug and inspect multiple highlighted regions. Reload a condition deep link. Test systemic drawer and touch preview → Open.
4. In browser DevTools Network, disable cache and reload. Record GLB/HDR transfer durations and total time until visible. `performance.getEntriesByName('rxatlas-model-ready')` records scene readiness; this excludes final GPU presentation.
5. After motion settles, inspect the canvas `data-frames` twice several seconds apart: it must remain unchanged, then increase during orbit or fly-to. Record a performance trace on the phone; 60fps is a target, not a verified result.

On-demand rendering and capped pixel ratio (1–1.5) reduce GPU work. Camera controls invalidate during motion. Contact shadows render once per selection/skin change. Dimmed anatomy uses 35% opacity and no depth writes; all anatomy remains in the scene except the optional skin toggle. Region framing uses CameraControls.fitToBox with real mesh bounds and 20% padding. Text navigation remains functional without WebGL.

## RxAtlas demos

- `/demos/`: feature gallery.
- `/demos/ten-powers/`: the scale journey, with optional `?scale=0` through `?scale=5`.
- `/demos/one-pill/`: the product journey, with optional `?stop=0` through `?stop=4`.

Both experiences are bundled locally from `demos-src` and served under `/demo-lab/`. Their canvases and styles are isolated in same-origin frames so Atlas anatomy, molecule and deep-dive logic are unaffected. The header and starting region panel link to the gallery. Each demo has a return to the body map.

Before the first build, install both dependency sets with `npm ci` and `npm ci --prefix demos-src`. The existing prebuild now builds and copies the demos. `npm run build:demos` rebuilds only the demo bundle. Runtime source requests and evidence notes retain their original behavior; see `demos-src/CREDITS.md` and the demo gallery's coverage note.
