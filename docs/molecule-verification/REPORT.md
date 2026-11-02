# Molecule viewer verification

Added only the molecular-view feature to drug profiles. The body viewer, anatomy model, clinical catalog, mode/search behavior and URL state are unchanged.

## Data and coverage

All 49 catalog drugs have a molecule card. The build contains 55 structure records: 49 small-molecule records (including combination ingredients and three requested verification examples), three proteins, two combination wrappers and one polymer-unavailable record. All 2,442 atom indices were checked across source SDF and RDKit depiction representations.

- Small-molecule formula and molecular-weight strings exactly match downloaded PubChem PUG REST properties.
- All displayed 3D atomic coordinates exactly match the parsed source SDF. No 3D coordinates are generated. RDKit generates 2D layouts only.
- Canonical/isomeric SMILES atom indices are mapped to the SDF via RDKit substructure matching. Both interactive views use the SDF atom order.
- All structures and the RDKit runtime are local static files. Browser verification recorded zero external requests.
- Combination ingredients are selectable separately; their formulas and weights are not presented as one molecule.
- Protein ribbons use deposited Cα coordinates and HELIX/SHEET annotations: glargine 6K59 (2 chains, 53 resolved residues), lispro 1LPH (4 chains, 102 residues), and a representative pancrelipase lipase–colipase component 1ETH (4 chains, 1,070 residues).

### Missing structures

**Polyethylene glycol 3350:** a distribution of polymer chain lengths, with no single representative molecular formula, molecular weight or conformer. The card explains this; no arbitrary oligomer is substituted.

**2D-only PubChem records:** linaclotide, mupirocin, nystatin A1, tenofovir disoproxil, velpatasvir, and nitroprusside. Each is labeled “3D structure not available.”

Nitroprusside's name lookup is currently a non-discrete PubChem reference record. The ChEBI deposit SID 8145943 links compound CID 11963622. That CID supplies the exact active composition C5FeN6O-2 and molecular weight 215.94 g/mol. PubChem depicts it as disconnected ionic components; the card explicitly states this, omits sodium, and never invents metal-coordination geometry.

Labetalol, esmolol, and nitroprusside were requested as verification examples but are absent from the current clinical catalog. Their data and cards were tested using an isolated, temporary fixture. They were not added to clinical search, treatments or the drug catalog. The fixture route is removed from the deployed site.

## Browser verification

Playwright + Chromium, ANGLE Vulkan SwiftShader, WebGL 2 confirmed. Screenshots use reduced motion to inspect settled views.

- Oxygen chip highlights both O atoms in 2D and 3D
- 2D hover synchronizes atom 0 with 3D and tooltip
- 3D mouse hover synchronizes the identical atom in 2D
- RDKit carboxylic-acid SMARTS highlights 3 matching atoms
- Space-filling and 2D style controls work
- Expand and Escape restore the card
- Actual Drug view loads the card; expanded view escapes the side panel
- Mobile atom tap and element-chip tap work; views stack

The existing full-atlas development scene logged one `removeChild` error during loading; this was also recorded before the molecule feature. All requested molecule screenshots and assertions completed. The body viewer was not changed to address that separate development issue. Hardware/phone frame rates were not measured.

## Screenshots

| Example | Light | Dark |
|---|---|---|
| ibuprofen | [Light](ibuprofen-light.png) | [Dark](ibuprofen-dark.png) |
| labetalol | [Light](labetalol-light.png) | [Dark](labetalol-dark.png) |
| esmolol | [Light](esmolol-light.png) | [Dark](esmolol-dark.png) |
| nitroprusside | [Light](nitroprusside-light.png) | [Dark](nitroprusside-dark.png) |
| insulin glargine | [Light](insulin-glargine-light.png) | [Dark](insulin-glargine-dark.png) |

Additional captures: [Drug panel](drug-panel.png), [Expanded view](drug-expanded.png), [Mobile](mobile.png), [Element highlighting](element-highlight.png), [Space-filling](space-filling.png).

## Repeatable build

Run `npm run build:drug-data` to download/cache source records, prepare atom mappings and protein backbones, and copy the local RDKit runtime. Add `--refresh` to `scripts/build-drug-data` to refetch records. Run `npm run verify:molecules` to verify every catalog entry, exact source property strings, atom identity/order, and unchanged 3D coordinates. The application prebuild also runs this verification.

Details: [data-report.json](data-report.json), [browser-report.json](browser-report.json).

Idle check: auto-rotation advanced the frame counter from 209 to 228. After interaction, it remained at 231 across the observation interval. See [idle-report.json](idle-report.json).
