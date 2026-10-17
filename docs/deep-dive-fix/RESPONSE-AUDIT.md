# Immediate-feedback audit

Baseline: published commit `714faa4d78303409767793522d754fd3132339cb`. Scope: the aortic-dissection route only.

| Suspected cause | Finding |
|---|---|
| Handler updates state the scene does not consume | Confirmed for previous caption steps and depth controls. They changed panel text without a matching scene transition. Now handled by one Zustand scene machine. |
| Invisible overlay intercepts events | Non-interactive HTML anatomy annotations now explicitly use `pointer-events: none`. Automated real pointer clicks are required. No evidence that an overlay intercepted the baseline preset buttons; do not attribute their failure to this without proof. |
| Normal mode gates presets | Not the baseline preset cause: both preset handlers already set dissection true. They now reset every conflicting state, including clipping, selection, comparison and rupture. |
| Camera does not show the action | Confirmed: baseline Rig ignored entry position and fitted the entire aorta for both presets. The new rig frames ascending/arch for A and arch/descending for B. |
| Only one duplicate variant wired | Source contains one Type A and one Type B button. Filled/outlined are styles of those same controls, not duplicate handlers. Tests exercise each from normal mode and again while active. |
| Prior test too permissive | Confirmed: the settled-pixel test waited 500 ms and did not enforce a first-response deadline. A separate 300 ms gate now records real canvas changes and camera/geometry changes. A failed deadline blocks release. |

Preset captions supplied in the request are marked pending review with the rest of Basics. The acute Type A emergency statement is supported by section 7.4.1.1 of the [2022 ACC/AHA guideline](https://pmc.ncbi.nlm.nih.gov/articles/PMC9876736/).

The `?debug=1` state overlay is available only in a development build (`npm run dev`). Production retains no visible debug UI. It shows mode, preset, entry, extent, playback and the camera target.

The response JSON is measured evidence, not an assertion that every device meets a universal deadline. A failing result must not be reported as passing.
