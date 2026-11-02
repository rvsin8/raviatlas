# RxAtlas visual restyle verification

The clinical catalog, molecule source files, anatomy GLB, region mappings, camera framing, raycasting, state store, and URL logic are unchanged from the previously published version.

## Changes

- `app/theme.css` is the central CSS-variable theme and Tailwind v4 theme extension. It includes all authored UI and scientific material colors, font settings, corner radii, and shadow tokens.
- DM Sans 400/500/600 is served locally, with its font license included. Serif typography and UI drop shadows are removed.
- Editorial region rows, section indices, real superscripts, pill controls, hairline borders, and light/dark palettes follow the requested direction.
- Body selection uses orange; hover uses blue tint. Existing anatomy materials and geometry are preserved. Molecule carbon uses graphite; carbon bonds in the 2D depiction use readable theme ink.
- Small orange text uses a darker derived tone because the supplied light `accent-ink` has only 4.12:1 contrast against white. The supplied palette token itself is retained.

## Verification

- Production static build, TypeScript, body verification, and molecule verification pass.
- Software WebGL 2 renders the complete anatomy model and molecule viewer.
- Browser interaction checks cover mode changes, search shortcut and results, drug/condition deep-link reload, Back, systemic drawer, skin URL state, theme switching, Breast fallback, molecule functional-group and element selection, atom hover/tap, display styles, and expand/close.
- Authored source audit: no hex color literals outside `app/theme.css` in `app`, `components`, `lib`, or `scripts`; no Georgia, Times New Roman, or Arial references. Generated SVG assets, third-party code, and scientific source data are excluded from that source audit.
- The anatomy export script reads its original 18 material colors from the theme file; the values are unchanged. No model rebuild or geometry changes were made.

## Existing limitation

The existing anatomy-loader `removeChild` console error also occurs in this build and is present in the previous molecule verification report. The body renders and the tested interactions pass. Its loading/rendering logic was left unchanged for this visual-only request. Software rendering verifies behavior and appearance, not real-device frame rate.

## Screenshots

Each view was captured in light and dark themes at desktop 1440×1000 and mobile 390×844. Mobile region/detail views use the existing expanded bottom sheet.

| View | Desktop light | Desktop dark | Mobile light | Mobile dark |
|---|---|---|---|---|
| Home | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-light-home.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-dark-home.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-light-home.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-dark-home.png) |
| Region | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-light-region.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-dark-region.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-light-region.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-dark-region.png) |
| Condition | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-light-condition.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-dark-condition.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-light-condition.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-dark-condition.png) |
| Drug | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-light-drug.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-dark-drug.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-light-drug.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-dark-drug.png) |
| Search | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-light-search.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-dark-search.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-light-search.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-dark-search.png) |
| Breast | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-light-breast.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/desktop-dark-breast.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-light-breast.png) | [Screenshot](sandbox:/workspace/scratch/a5ba70be44b2/rxatlas/docs/restyle-verification/mobile-dark-breast.png) |

Text contrast audit passed for the sampled home, region, drug, Breast, and search views in both themes. Lowest sampled text contrast: 4.6:1. DM Sans loaded successfully.
