# Demo integration

Base: published RxAtlas source 2eb4cf838320d92941242ea16207e3fff46b04b7.
Demo source: 1fcfec847b316ebcfc9e910b5b2ea2c1630c0c6f.

Added a Demos gallery, two local experience routes, header/start-panel entry points, and URL-state messages scoped to the same-origin frame. Demo JavaScript, fonts, anatomy, molecular data, imagery and credits are bundled with Atlas. The existing body model, catalog, molecules, deep dives and theme are unchanged.

Validation: existing prebuild model verification, molecule verification, relationship generation, demo data checks, Next.js production/type build, exported-route and asset checks. Existing anatomy verifies at 11,197,332 bytes with all 2,237 source parts rendered. No scientific catalog changes.

Browser/WebGL verification is unavailable through the managed environment's supported browser skill. The browser-dependent lifecycle tests were not run; prebuild validations were run explicitly and the production build used lifecycle scripts disabled. Existing test definitions remain unchanged. No visual or performance claim is made from these static checks.

Known demo limitations remain visible: absent cell geometry, illustrative route legs, unverified API-site counts and shortage history. These were not relabeled as complete or verified during integration.
