# Verification

- Clean dependency installation passed.
- Automated source/data/model checks: 15 passed.
- Body GLB: 11,197,332 bytes, 55 meshes; unchanged from recovered real-geometry asset.
- Heart GLB: 416,316 bytes; extracted real heart node with its existing transform.
- PubChem conformer: CID 2585.
- Bound structure: PDB 4AMJ, chain A receptor and 30 non-hydrogen CVD atom records. Binding animation returns coordinates to the deposited pose exactly.
- Route coordinates: Census-geocoded Hillside Avenue pharmacy and East Windsor label address; attributed city references for Hyderabad and Pennington.
- No verified shipment arcs. Unlocated supplier and wholesaler steps retain null coordinates.
- Application code contains no Web Worker construction and no primitive anatomy geometry. 3Dmol surface calculations are not used.
- Direct static route entry files generated for both experiences.

## Limits
Browser/WebGL visual QA was not performed because the managed browser-control skill is unavailable. Build and data checks are not visual verification or performance measurements. Test on desktop and mobile: globe drag, each scale, wheel/pinch/arrow navigation, real GLB framing, binding motion, comparison, journey play/pause, bottom sheets and source links.

The cell model is missing; the app labels it explicitly. Supply a licensed real cardiomyocyte GLB at public/models/cell.glb. No primitive substitute is rendered.

Queens uses public-domain aerial imagery, not satellite imagery. PDB 4AMJ is an engineered turkey receptor, not a human receptor. The selected product is carvedilol 25 mg solely for identification; no administration guidance is provided.

No physical bottle's complete route has been established. API sites, wholesaler and shortage history are not verified. The UI preserves those uncertainties rather than manufacturing counts, events or companies.
