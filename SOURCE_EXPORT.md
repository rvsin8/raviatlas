# RxAtlas source export

Export date: **2026-11-02 UTC**  
Source: **Sites version 18**  
Original source commit: **`e05e8e62f73acffe90a88513950c8ab1d1f63201`**  
Original source tree: **`d855740d6f9f59a49d838aa11e71d6cde583ee05`**

This branch imports the current tracked RxAtlas application source and assets into the existing repository. Application code, runtime assets, credits, metadata, and all other retained source files are unchanged from the source commit.

## Two omitted QA evidence archives

The GitHub connector has a 16 MiB request-body limit. Base64 encoding makes these two derived QA evidence ZIPs exceed that limit, so they are omitted from this repository export:

| Original tracked path | Original bytes | Original Git blob SHA-1 |
| --- | ---: | --- |
| `docs/clinical-deep-dives/clinical-evidence.zip` | 16,696,333 | `a956be551671374efb2ab4b504087b9bdc16e86c` |
| `docs/deep-dive-fix/verification-evidence.zip` | 13,939,800 | `2a687df4dca1ff3525e50c19172a0048a51263d5` |

These omissions affect packaged QA evidence only. They do not remove application code or runtime assets. The original archives remain included in the separately provided full snapshot, **`raviatlas-source-v18-2026-11-02.zip`**.

## Scope and verification

The intended GitHub tree consists of every tracked file from the original source commit, except the two paths above, plus this `SOURCE_EXPORT.md` note. It therefore intentionally differs from the original unfiltered source tree. The import preserves the existing `main` and `feature/heart-brain-explorers` branches and does not deploy the application.

Import verification checks file identities and the filtered export tree. It does not establish new application test, clinical validation, performance, or visual-quality results.

