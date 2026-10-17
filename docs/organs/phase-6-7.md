# Brain imaging: remaining engineering and release verification

## Phase 6 — implementation complete

- Existing React Three Fiber renderer and static preprocessing are retained. No inference backend, new rendering engine, patient uploads, Web Workers, or remote clinical API calls were added.
- Runtime volume loader admits only the two registered sequences and their mask. It verifies compressed byte length and SHA-256 before decoding, then checks exact calibrated dimensions. The decoded buffer is bounded; corrupted/truncated/stale assets cannot silently become an image.
- Concurrent requests share one promise; successful volumes are cached, failed requests are evicted for retry. Hash-keyed URLs separate asset versions. Transfers time out with a user-facing retry message.
- The maximum retained decoded cache is 44,640,000 bytes (two uint16 signals and one uint8 mask), excluding temporary compressed buffers and GPU resources. FLAIR still loads only when requested, and detailed organs/MRI do not load at initial atlas entry.
- 3D slice planes now allocate their image texture only when that plane's slice, display settings, or data changes. Crosshair movement within a plane no longer rebuilds its texture. Plane geometry is independent of image contrast/opacity changes. Hidden planes do not allocate textures. Resources are disposed on replacement/unmount.
- Completely transparent tumor surfaces no longer receive invisible clicks. WebGL context loss offers Restore 3D while calibrated slices and findings stay usable. Failed surface loads offer Retry 3D. These recovery flows still require browser acceptance.

## Phase 7 — automated non-browser verification complete; browser acceptance blocked

| Gate | Result |
|---|---|
| State, navigation, clinical deep-dive, imaging and loader tests | 95 passed |
| Native MRI/mask registration and measurements | 31 passed; original source files checked |
| Heart/Brain source geometry verification | Passed |
| TypeScript and production static build | Passed |
| Runtime delivery hashes, source/export agreement, protected atlas files | Passed; see delivery-verification.json |
| Browser screenshots and interaction/pixel-diff acceptance | Not run |
| Desktop/mobile FPS and real-device performance | Not measured |
| Qualified medical review | Pending |

`npm run verify:imaging` reruns the non-browser regression suite and is part of the normal prebuild gate. `python scripts/imaging/verify.py` checks the original source when available. `node scripts/organs/verify-assets.mjs` checks the real organ extracts. `node scripts/imaging/verify-delivery.cjs` checks the built export and unchanged protected files.

The current managed Sites environment has no supported control-browser capability. Its skill explicitly forbids substituting a preview server or another browser path when that capability is absent. No browser run, screenshot, FPS, pixel-diff pass, or visual sign-off is claimed. Phase 7 cannot honestly be marked fully complete until this gate runs.

## Prepared local browser acceptance harness

`scripts/imaging/browser-acceptance.cjs` is syntax checked, **not browser executed**. It accepts an already running local production export and an installed Chrome/Chromium executable. It never starts a server or installs a browser. It intentionally refuses to run in the restricted managed Sites environment.

On a local machine, build/export the site and serve `out/` using your usual local static server. Set:

```bash
RXATLAS_TEST_URL=http://127.0.0.1:4173 CHROME_PATH=/absolute/path/to/chrome npm run verify:imaging:browser
```

The harness checks software WebGL 2, four desktop/mobile-emulation × light/dark scenarios, selected findings, guided states, deep-link reloads, orthogonal slices and keyboard controls, zoom/pan, sequence and contrast, class/opacity/plane controls, comparison, framing, reset, 2D fallback, actual context loss/recovery, condition/treatment navigation, and return to the atlas. It compares canvas screenshots for visual controls, checks URL state, rejects console errors, saves screenshots and a JSON report, and samples rendered frames during orbit and while idle. Review and fix any failures before claiming browser acceptance. Mobile emulation is not a substitute for a physical phone check.

Output: `docs/organs/browser-evidence/`. No output report exists until the harness actually runs; absent evidence must not be interpreted as a pass.

## Actual metrics

MRI assets remain 7,728,923 bytes total; initial T1/mask/surface payload 5,037,451 bytes. Registered surfaces remain 123,274 triangles. No geometry or annotation changed.

`host-pipeline-benchmark.json` records 40 measured CPU slice-generation iterations after warm-up on the execution host. This measures pixel computation only—not browser latency, GPU rendering, desktop/phone FPS, or a clinical performance metric. Load/decode duration remains measured in the viewer's own session.

## Remaining external gates and scope limits

1. Run and inspect the browser harness, including screenshots and console output; manually verify main body camera/focus/scroll restoration and a physical phone.
2. Obtain qualified review of anatomy labels, schematic animations, and medical explanations before claiming clinical validation.
3. No validated annotated stroke, Alzheimer’s, or MS case is supplied. Those imaging actions remain disabled. No confidence maps or AI interpretations are invented. Core glioma MRI-to-3D education is implemented.

The earlier Heart/Brain asset limitations remain explicit: Blender/Scenario execution was unavailable; no fabricated septum, valve animation, validated cut section, or unvalidated cerebral vessel-flow path was substituted.
