# Aortic dissection control audit

Scope: only the deep-dive route. Source baseline 714faa4d78303409767793522d754fd3132339cb. All clinical explanations remain human-review pending.

| Control | Previous handler / behavior | Shared handler and scene effect |
|---|---|---|
| Five segment rows | Local patch; clicking again cleared selection | `patch({segment})`; clock-driven camera fit, orange outline/emission, others dim; already selected rows disabled with a tooltip |
| Place entry tear | Local tool flag, no preview or cancel | `patch({tool})`, `previewAt`, `place`; surface ring, crosshair, Escape; opening and 2.5-second propagation |
| Place tear in segment | Direct local entry update | `patch({entry})`; same propagation and framing as surface click |
| Type A / Type B | Local patch + reset counter, entire-aorta framing | `preset`; immediate affected-wall tint, orange marker, correct ascending/arch or arch/descending framing, active state, replay from zero |
| Compare / Exit Compare | Absent | `patch({compare})`; same real path and shared progress on two side-by-side aortas; returns to single view |
| Normal / Dissection | Local boolean, label described opposite action | `patch({dissection})`; intact/cutaway state; button labels the destination mode |
| Play / Pause | Multiple independent clocks, camera remained animated | `patch({playing})`; one clock controls camera, heart, flow, flap, rupture |
| Animation speed | Scaled separate local clocks | `patch({speed})`; scales shared clock |
| Distal extent | Changed mesh interval | `patch({extent})`; immediate lumen/flap interval, classification and branch emphasis |
| Cross-section | Plane and inset | `patch({cross})`; framed clipping plane, inset and draggable/keyboard handle |
| Slice slider / handle | Slider only | `patch({slice})`; same plane and camera target, mapped to real centerline |
| Follow the blood | Local journey flag | `patch({journey})`; ghost-body framing, real-organ perfusion, branch flow |
| Heart rate + blood pressure | Separate local animation variables | `patch({load})`; continuous five-stop control drives heartbeat, ECG, wave bulges, wall expansion, flap flutter, tear growth, flow and real-artery glow; camera holds its focus |
| Heartbeat sound | Absent | `patch({sound})`; off by default, shared-beat audio and a visible wave marker |
| Watch what could happen | Absent | Appears only after sustained Very high; explicit click calls `place` near the entry to start rupture; never automatic |
| Type A overlays | Independent local flags | `patch({tamponade/regurgitation/coronary})`; heart framing, pericardial particles, reverse flow, coronary highlight |
| Reset icon | Camera only | `reset`; intact aorta, default camera, normal mode, playing |
| Reset text | Local defaults | `reset`; same complete reset |
| Previous / Next captions | Text index only; no scene change | `step`; normal, entry, false lumen, cross-section, perfusion scene states |
| Basics / Detailed / Clinical | Panel text only | `patch({depth})`; overview/wall/body framing; explicit Coming next states |
| Return to Basics / clinical link | Panel text only | Same depth transitions |
| Branch disclosure | Native disclosure only | `patch({branches})`; branch emission and overview framing |
| Sources disclosure | Native disclosure only | `patch({sources})`; ghost anatomy opacity and body context |
| Theme | CSS only | `patch({theme})`; renderer background and materials refresh from theme |
| Mobile sheet button / drag | Local sheet state | `patch({sheet})`; shared state and viewport reframe |
| Rupture placement | Absent | `place`; interval validation, four-beat scene timeline, location-specific collection |
| Rupture timeline / four beat buttons | Absent | `scrub`; deterministic clock, camera, wall, blood and perfusion; pauses |
| Timeline play / slow motion | Absent | Same playing and speed state |
| RxAtlas / source citation links | Navigation | Remain navigation; not scene animation controls |

Temporal controls are verified using moving frames. Pause is verified by absence of motion. The active segment is disabled with an explanation; repeated preset clicks replay their animation. Disabled actions are not dead controls. All explanatory blood collections are schematic and derived from real context geometry; no substitute anatomical organ meshes are added.
