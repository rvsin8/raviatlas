# Phase 2 — registered tumor segmentation

The initial imaging release already included the real native mask, class surfaces, calibrated volume measurements, opacity/visibility, and findings. This pass refines selection and camera interaction without changing the scans, labels, surfaces, or existing full-body/Heart features.

Implemented:

* A surface click maps back through the shared inverse affine and finds a neighboring source voxel carrying the same label. It no longer rounds a mask boundary into background.
* Clicking a 3D slice also selects the corresponding source annotation, when one exists.
* Repeated selection of an active finding re-frames it. Camera modes are explicit: whole brain, selected finding, or follow the linked crosshairs. The mode is shareable through `frame=finding` or `frame=cursor`.
* The selected mask has a 3D label and pointer affordance. A hidden selected class cannot be focused through the focus control; the reason is exposed as a tooltip.
* MRI wheel navigation consumes the wheel event rather than scrolling the surrounding page at the same time. Pointer crosshair movement replaces transient URL state rather than adding a history entry for every pixel.
* Two MRI sequences, class visibility, mask opacity, native voxel measurements, and confidence-unavailable disclosure remain in place.

Verification:

* **82 state/unit tests pass.** New checks cover physical picking for every exported tumor surface vertex, the same real class in all three orthogonal slices, source-label selection at boundaries, and URL round-tripping of camera modes.
* The image, mask and GLB bytes are identical to the initial release. The existing **31 spatial/measurement checks** still apply.
* No prediction, inferred confidence score, synthetic lesion, or clinical diagnostic claim was added.
* Browser visual and mobile FPS checks remain unavailable. These software changes are not represented as browser-tested or medically validated.
