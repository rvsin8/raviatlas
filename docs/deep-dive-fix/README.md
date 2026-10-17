# RxAtlas deep-dive verification

The aortic-dissection route now uses one Zustand scene timeline for camera motion, heartbeat, flow, flap progression and rupture. The original body geometry and molecule renderer are unchanged. The separately requested DVT/PE and asthma additions extend the catalog, anatomy assets, and entry links; their evidence is reported separately. The separately requested body mode heatmap changes only shading, legend/hover labels, mode color tokens, and camera stability during mode switches.

## Results

- 54 state-and-canvas checks, plus actual desktop/mobile surface placement and mobile sheet checks.
- 47 immediate-response checks pass the 300 ms gate; maximum observed first response 247.4 ms.
- Four real GIF recordings: Type A, Type B, Compare A vs B, and Normal reset.
- 41 unit tests passed (classification, URL, geometry and state-machine cases).
- WebGL 2 verified with Chromium SwiftShader. No page errors.
- Software-rendered rupture FPS: desktop 7.98; mobile viewport 6.98. These are software-rendering measurements, not physical-device performance claims.
- 56 final screenshots; real screen capture in tear-to-rupture.mp4.

## What changed

The preset camera previously ignored the entry location and framed the full aorta. First-use geometry rebuilds and clipping shader changes also delayed feedback; geometry is now reused and clipping stays compiled. Filled and outlined preset styles use the same handlers. Compare uses two copies of the same real aortic path and one synchronized timeline.

The previous controls used separate local clocks and some changed only text. The shared state machine now drives scene selection, camera framing, propagation, pause/speed, caption steps, depth scaffolds, clipping and perfusion. Rupture placement validates the dissected interval, then plays four scrubbable beats: wall bulging/thinning, local opening, escaped-blood collection and systemic effects. Qualitative vital indicators occupy the caption panel rather than obscuring the anatomy.

## Interpretation and limitations

All explanatory content is human-review pending. The blood collections are schematic teaching effects derived from real context geometry; they are not segmented pericardial, pleural or retroperitoneal cavity models. Organ-perfusion changes illustrate a possible pattern, not an inevitable outcome or patient simulation. No treatment targets or dosing are introduced.

BodyParts3D © DBCLS, CC BY 4.0, license updated 2025-02-27. Existing release 4.0 / 4.3 assets retained.

References: [2022 ACC/AHA guideline](https://www.ahajournals.org/doi/10.1161/CIR.0000000000001106); [SVS/STS reporting standards](https://www.sts.org/sites/default/files/documents/STS-SVS-ReportingStandardsTypeBAorticDissections.pdf); [DBCLS license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html).

See CONTROL-AUDIT.md for every control and handler, and the JSON reports for individual results. Pause is tested by absence of motion; active segment and depth controls are disabled with explanations; presets replay on repeat clicks. Navigation links retain their purpose.
