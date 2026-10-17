# RxAtlas clinical deep dives — verification

Software WebGL 2 was available. These are browser-rendered screenshots and recordings, not generated mockups. All medical copy remains pending human review.

## Scope

- Five-stop aortic pulse slider: heartbeat, ECG, optional sound, pulse rings, wall/flap movement, growth, flow and gauges share one clock. Low and Very low stop tear growth. Sustained Very high offers rupture playback; it never starts it automatically.
- DVT/PE: calf pump, stasis, source-derived venous journey, pulmonary obstruction, anticoagulant clearance, thrombolysis, IVC filter and comparison.
- Asthma: source airway tree and representative airway section, triggers, rescue, controller, comparison and optional sound.
- New catalog entries have static molecular assets or explicit mixture notes. No dosing.

## Control audit

| Topic | Control | Visible result | Changed canvas pixels | Result |
|---|---|---|---:|---|
| dvt-pe | still  | Calf pump and flow switch between motion and pooling | 1.489% | PASS |
| dvt-pe | form-clot  | Camera frames a growing layered clot in the calf vein | 44.669% | PASS |
| dvt-pe | release-clot  | Clot travels and camera follows the real venous route | 46.385% | PASS |
| dvt-pe | large  | Main-split clot, wider lung dimming and right-heart strain | 21.478% | PASS |
| dvt-pe | anticoagulant  | Growth stops; slow endogenous clot clearance is shown | 9.668% | PASS |
| dvt-pe | thrombolytic  | Rapid clot shrinkage and recovering perfusion | 31.941% | PASS |
| dvt-pe | filter  | A visible IVC filter catches the traveling clot | 31.801% | PASS |
| dvt-pe | compare  | Switches between single and side-by-side anatomy | 11.826% | PASS |
| dvt-pe | compare  | Switches between single and side-by-side anatomy | 2.765% | PASS |
| dvt-pe | normal  | Restores normal flow or the open airway | 0.359% | PASS |
| dvt-pe | next  | Caption and scene advance together | 1.122% | PASS |
| dvt-pe | previous  | Caption and scene move back together | 2.136% | PASS |
| dvt-pe | speed 0.35 | Flow rate and readable motion markers change | 0.104% | PASS |
| dvt-pe | speed 2 | Flow rate and readable motion markers change | 0.211% | PASS |
| dvt-pe | clot-site 0.15 | Clot moves to the chosen source-vein location | 21.323% | PASS |
| dvt-pe | release-clot  | Clot travels and camera follows the real venous route | 22.220% | PASS |
| dvt-pe | timeline 6 | Clot and camera seek together | 10.941% | PASS |
| dvt-pe | depth-detailed  | Anatomy context changes and Coming next appears | 0.578% | PASS |
| dvt-pe | depth-clinical  | Body context changes and Coming next appears | 9.622% | PASS |
| dvt-pe | return-basics  | Restores the active example and its camera frame | 9.631% | PASS |
| dvt-pe | play  | Freezes/resumes the shared clock; paused illustration dims | 13.931% | PASS |
| dvt-pe | play  | Freezes/resumes the shared clock; paused illustration dims | 12.297% | PASS |
| dvt-pe | theme  | Canvas background and material palette change | 99.922% | PASS |
| dvt-pe | reset  | Returns to intact anatomy, normal flow and default framing | 11.467% | PASS |
| dvt-pe | sources  | Source disclosure and anatomy context framing change | 2.220% | PASS |
| dvt-pe | sources  | Source disclosure and anatomy context framing change | 29.596% | PASS |
| asthma | zoom-1  | Camera frames the selected real anatomy or representative airway section | 0.636% | PASS |
| asthma | zoom-2  | Camera frames the selected real anatomy or representative airway section | 3.348% | PASS |
| asthma | zoom-3  | Camera frames the selected real anatomy or representative airway section | 21.632% | PASS |
| asthma | trigger-pollen  | Trigger starts muscle tightening, lining swelling, mucus and reduced flow | 19.958% | PASS |
| asthma | trigger-cold-air  | Trigger starts muscle tightening, lining swelling, mucus and reduced flow | 1.402% | PASS |
| asthma | trigger-exercise  | Trigger starts muscle tightening, lining swelling, mucus and reduced flow | 4.808% | PASS |
| asthma | trigger-smoke  | Trigger starts muscle tightening, lining swelling, mucus and reduced flow | 3.683% | PASS |
| asthma | sound  | Wheeze audio toggle and visible wave marker | 11.560% | PASS |
| asthma | sound  | Wheeze audio toggle and visible wave marker | 0.346% | PASS |
| asthma | rescue  | Puff travels down the trachea; muscle relaxes | 10.188% | PASS |
| asthma | controller  | Lining swelling falls; later triggers have less effect | 15.167% | PASS |
| asthma | montelukast  | Inflammation target highlights with leukotriene explanation | 0.932% | PASS |
| asthma | compare  | Switches between single and side-by-side anatomy | 26.384% | PASS |
| asthma | compare  | Switches between single and side-by-side anatomy | 14.215% | PASS |
| asthma | normal  | Restores normal flow or the open airway | 15.227% | PASS |
| asthma | next  | Caption and scene advance together | 14.561% | PASS |
| asthma | previous  | Caption and scene move back together | 13.919% | PASS |
| asthma | speed 0.35 | Flow rate and readable motion markers change | 0.357% | PASS |
| asthma | speed 2 | Flow rate and readable motion markers change | 1.216% | PASS |
| asthma | depth-detailed  | Anatomy context changes and Coming next appears | 3.435% | PASS |
| asthma | depth-clinical  | Body context changes and Coming next appears | 3.714% | PASS |
| asthma | return-basics  | Restores the active example and its camera frame | 2.611% | PASS |
| asthma | play  | Freezes/resumes the shared clock; paused illustration dims | 2.228% | PASS |
| asthma | play  | Freezes/resumes the shared clock; paused illustration dims | 2.573% | PASS |
| asthma | theme  | Canvas background and material palette change | 99.222% | PASS |
| asthma | reset  | Returns to intact anatomy, normal flow and default framing | 4.782% | PASS |
| asthma | sources  | Source disclosure and anatomy context framing change | 2.180% | PASS |
| asthma | sources  | Source disclosure and anatomy context framing change | 2.335% | PASS |

Canvas threshold: more than 0.05% of sampled pixels change by over 10 channel levels. Unavailable controls are disabled.

## Aortic pulse stops

| Stop | Animation cycles/s | Tear growth setting | Canvas change |
|---|---:|---:|---:|
| Very low | 0.45 | 0 | baseline |
| Low | 0.8875 | 0 | 5.35% |
| Normal | 1.325 | 0.0005 | 4.14% |
| High | 1.762 | 0.02133 | 3.83% |
| Very high | 2.2 | 0.04 | 5.94% |

These are internal animation parameters, not clinical vital signs or a validated prediction of rupture. The interface is qualitative. Low-end growth was asserted to be zero, phase advanced, and frequencies matched the configured stop values.

## Performance

| Scene | Software-rendered FPS |
|---|---:|
| Desktop: dvt-pe-journey | 53.91 |
| Desktop: asthma-attack | 10.24 |
| Mobile emulation: dvt-pe-impact-mobileEmulation | 25.46 |
| Mobile emulation: asthma-attack-mobileEmulation | 10.48 |
| Aortic Very high: desktop | 1.64 |
| Aortic Very high: mobileEmulation | 1.51 |

All clinical controls use useClinicalStore.act; reset uses the same store’s reset action, URL restoration uses restore, and tick advances the shared scene clock. URL navigation now increments the camera revision. The airway screenshot checks also require visible geometry, not merely a pixel difference.

SwiftShader measurements are not physical phone/GPU results. Smoothness on a real laptop and phone still needs a device check; no 60 FPS claim is made.

## Anatomy and content provenance

The main body GLB and molecule renderer are unchanged. New scenes extract registered BodyParts3D meshes and centerlines without per-part centering. Smooth vessel joins, valve leaflets, clot, airway layers and blood flow are labeled teaching schematics. Chamber transit is an illustrative path through the real chamber geometry. The representative airway wall layers are not segmented histology.

BodyParts3D © DBCLS, CC BY 4.0 (license updated 2025-02-27); releases 4.0 and 4.3. See CREDITS.md.

Sources: ASH 2020 VTE guidelines; CHEST 2021 antithrombotic guideline; GINA 2026 strategy report; NAEPP 2020 focused updates; ACC/AHA 2022 aortic guideline. All new text is pending review.

Molecules: PubChem static structures for the requested small molecules; alteplase uses PDB 1RTF, a representative catalytic domain, not the complete protein. Heparin and enoxaparin are mixtures and intentionally have no single-molecule structure. The catalog-wide availability notes also include polyethylene glycol 3350, a polymer distribution. Existing 2D-only records are linaclotide, mupirocin, nitroprusside, nystatin, tenofovir disoproxil and velpatasvir. No unexpected structure gap remains among the newly requested drugs.

## Evidence

- [clot-journey.gif](clot-journey.gif) — 186 captured frames
- [anticoagulant.gif](anticoagulant.gif) — 256 captured frames
- [thrombolytic.gif](thrombolytic.gif) — 44 captured frames
- [ivc-filter.gif](ivc-filter.gif) — 128 captured frames
- [attack-rescue.gif](attack-rescue.gif) — 39 captured frames
- [controller-time-lapse.gif](controller-time-lapse.gif) — 45 captured frames
- [pulse-sweep.gif](pulse-sweep.gif) — 28 captured frames
