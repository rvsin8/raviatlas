# Credits

## Anatomical geometry — releases 4.0 and 4.3

BodyParts3D © DBCLS, CC BY 4.0 (license updated 2025-02-27).

Required attribution: BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- Author: The Database Center for Life Science (DBCLS), Japan.
- Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- Archive: `isa_BP3D_4.0_obj_99.zip` (BodyParts3D 4.0), with official FMA composition and PART-OF/IS-A tables.
- Current official license: Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/
- Official licensing statement: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- The official README records the license update on February 27, 2025. Legacy OBJ headers in this 2013 archive still name CC BY-SA 2.1 Japan (https://creativecommons.org/licenses/by-sa/2.1/jp/). Both allow commercial use; current distribution is under the official CC BY 4.0 statement.
- Changes by RxAtlas: selected structures, grouped regional nodes, coordinate normalization, matte colors, generated normals, mesh simplification and Meshopt compression. FMA classification and manual assignments need anatomical review. No replacement anatomy was generated from primitives.

### Thyroid from release 4.3

- Official source: https://lifesciencedb.jp/bp3d/
- Version-stamped FMA mapping: https://lifesciencedb.jp/bp3d/get-info.cgi?version=4.3&cmd=concept-objfiles-list
- Geometry downloaded directly from the official `download.cgi` endpoint by scripts/fetch-thyroid.py.
- Thyroid gland **FMA9603** (PART-OF): FJ3670 isthmus (FMA49178), FJ3671 left lobe (FMA13369), FJ3672 right lobe (FMA13368). These are gland meshes, not thyroid cartilage.
- Shared reference: FJ2808 thyroid cartilage (FMA55099) has exactly identical raw bounding coordinates in releases 4.0 and 4.3, with 0.0 mm difference. Both use the same source millimetres and Z-up coordinates. The same normalization is applied without translation, warping or approximate registration. Clinical/anatomical visual review remains pending.
- License follows DBCLS's current BodyParts3D database-wide declaration linked above, updated 2025-02-27; older source headers retain the historical CC BY-SA 2.1 JP notice.

### Coverage and adaptation

Adult male model. Breast has no dedicated geometry: real pectoralis-major surfaces are highlighted solely as a regional locator. Female reproductive anatomy is absent; female-specific conditions use the corresponding pelvic view. Elbow navigation uses the real paired anconeus muscles (FMA37704 and its left/right parts), not an invented joint mesh. It does not represent every elbow ligament or articular surface.

The revised pipeline uses simplification error 0.001, smooth recomputed normals, and Meshopt compression. Overrides and unresolved parts remain pending anatomical review. Spatial suggestions in the mapping report are review aids, not confirmed FMA assignments.

## Studio environment

Studio Small 03 by Greg Zaal / Poly Haven, CC0.
https://polyhaven.com/a/studio_small_03
https://creativecommons.org/publicdomain/zero/1.0/

The locally served HDR is the studio preset asset used by Drei, downloaded from its pinned drei-assets distribution. It avoids a runtime dependency on the CDN.

## Molecular structures and chemistry viewer

- Small-molecule records and source SDF coordinates: [PubChem, NCBI/NLM](https://pubchem.ncbi.nlm.nih.gov/). Exact CID, property-request URL, formula, molecular weight and source record are stored with each molecule. No molecular coordinates are invented.
- Protein backbone coordinates: [RCSB PDB](https://www.rcsb.org/), entries [6K59](https://www.rcsb.org/structure/6K59) (insulin glargine), [1LPH](https://www.rcsb.org/structure/1LPH) (insulin lispro), and [1ETH](https://www.rcsb.org/structure/1ETH) (representative porcine pancreatic lipase–colipase complex). Ribbon geometry interpolates the deposited Cα backbone; helix and sheet assignments come from the PDB records. First deposited model shown.
- [RDKit.js](https://www.rdkitjs.com/), version 2026.03.6, provides local 2D depictions and SMARTS matching. BSD 3-Clause license; retained notice in `public/vendor/rdkit/LICENSE.txt`.

### DVT/PE and asthma deep dives
The venous, right-heart, pulmonary-arterial and bronchial surfaces are extracted from the same registered BodyParts3D 4.0 geometry, with source-part IDs preserved in `clinical-anatomy.glb` and `clinical-anatomy.json`. No per-part transforms are applied. Centerlines come from triangle-plane intersections. Clots, valve motion, airway wall layers and transit between right-heart chamber centers are schematic teaching effects, not separately segmented anatomy. Rebuild with `node scripts/clinical-deep-dives/extract.mjs` and `python3 scripts/clinical-deep-dives/centerlines.py`.

Additional molecule structures: PubChem PUG REST (rivaroxaban, warfarin, montelukast and existing inhaled drug active molecules); RCSB PDB 1RTF, the experimental catalytic domain of human tissue plasminogen activator, shown as a representative domain rather than the complete alteplase protein. Heparin and enoxaparin are mixtures and have no single structure substituted. All new educational content awaits human review.

## Integrated demos: Ten Powers and One Pill
The two demos are bundled from the Ten Powers / One Pill source checkpoint, commit 1fcfec847b316ebcfc9e910b5b2ea2c1630c0c6f, under demos-src. Their real-model, NASA/USGS, PubChem, PDB, font and geographic credits are in demos-src/CREDITS.md and served at /demo-lab/CREDITS.md. PDB 4AMJ depicts an engineered turkey receptor. The missing cell model and uncertain supply-chain evidence remain explicitly disclosed.

## Female anatomy — Human Reference Atlas v1.10

Human Reference Atlas, CC BY 4.0, from the NLM Visible Human Project.

- Author/publisher: Human Reference Atlas Consortium; source geometry credits are retained by the reference-organ release below. The united set combines NLM Visible Human female anatomy with additional organ references (including Allen brain structures); it is not a complete scan of a single person.
- Exact release and license: https://apps.humanatlas.io/kg-explorer/ref-organ/united-female/v1.10
- Official source asset: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/3d-vh-f-united.glb
- Reference library: https://humanatlas.io/3d-reference-library
- NLM provenance: https://3d.nih.gov/entries/20992 (an earlier published version of the same reference set).
- License: Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/
- Downloaded 2026-10-14. Source SHA-256: `95f0c3d2f918582608692ca1139e8bdb18c147a16470e9ee9af8b276bd77c422`.
- RxAtlas adaptations: retain original assembled world transforms; apply one uniform normalization to the male reference's height and ground plane; remove separately posed placenta/umbilical and lymph-node sample references; group source meshes by region and tissue; apply atlas tissue colors; weld, simplify at error 0.001, recompute smooth normals, and Meshopt-compress. No generated replacement anatomy, per-part recentering, pose warping, or non-uniform scaling.
- Rebuild: `node scripts/build-female-model.mjs`. Full per-source-node mapping, exclusions, transform, bounds, size, triangle count and missing-region list: `data/model-reports/female-build.json`.
- Internal anatomy coverage is partial. In particular this set lacks separate thyroid gland, stomach, esophagus, diaphragm, ears, nose/sinus, jaw, face, arm/hand internal anatomy, calf and foot meshes. These are marked unavailable. The real outer skin surface is separately toggleable. Prostate and testes remain male-only. Breast, uterus, ovaries, and fallopian tubes have real female meshes.
- The wider female arm pose is retained; uniform scaling aligns height and facing without pretending the different source bodies have identical proportions. Switching bodies preserves the current camera; Reset camera fits the active reference's full bounds.
- The original male GLB remains byte-for-byte unchanged. Prostate/testes navigation partitions existing source triangles using the retained `_SOURCE_PART` identity, without replacing or moving any vertex.
- Anatomical mapping and educational clinical content remain pending human review.

## Heart and Brain Explorer extracts

BodyParts3D © DBCLS, CC BY 4.0 (license updated 2025-02-27), release 4.0 source anatomy retained from the existing body asset. Source: https://lifesciencedb.jp/bp3d/ . These separate organ files preserve source FMA identifiers and registered coordinates. Both body choices use the same clearly labeled adult male reference organ extracts. Geometry and new educational animations await expert review. Blender was not run for these extracts.

## Brain MRI imaging demonstration

Medical Segmentation Decathlon / BraTS contributors, Task01 BrainTumour, release 2.0 04/05/2018, case BRATS_457. Original source: https://msd-for-monai.s3.amazonaws.com/Task01_BrainTumour.tar . License: **CC BY-SA 4.0**, https://creativecommons.org/licenses/by-sa/4.0/ . Official license records: https://medicaldecathlon.com/ and https://registry.opendata.aws/msd/ . Derived MRI volumes, label masks, surfaces and the MRI registration evidence figure are also CC BY-SA 4.0. Adaptations: canonical reorientation, signal quantization, lossless mask compression, and mask-derived surface reconstruction. No AI inference is performed.

Dataset and annotation references:

- Antonelli et al., *The Medical Segmentation Decathlon* (2022), https://doi.org/10.1038/s41467-022-30695-9 .
- Menze et al., *The Multimodal Brain Tumor Image Segmentation Benchmark (BRATS)* (2015), https://doi.org/10.1109/TMI.2014.2377694 .
- Bakas et al., *Advancing The Cancer Genome Atlas glioma MRI collections with expert segmentation labels and radiomic features* (2017), https://doi.org/10.1038/sdata.2017.117 .
- Bakas et al., *Identifying the Best Machine Learning Algorithms for Brain Tumor Segmentation, Progression Assessment, and Overall Survival Prediction in the BRATS Challenge* (2018), https://arxiv.org/abs/1811.02629 .
- TCGA-GBM annotation collection: https://doi.org/10.7937/K9/TCIA.2017.KLXWJJ1Q ; TCGA-LGG annotation collection: https://doi.org/10.7937/K9/TCIA.2017.GJQ7R0EF . This MSD pseudonymous case is not asserted to belong to either collection without a verified crosswalk.
- Annotation protocol and preprocessing: https://www.med.upenn.edu/sbia/brats2017/data.html . The MSD release uses remapped numeric class IDs; use its supplied dataset manifest.

Educational treatment context: National Cancer Institute, https://www.cancer.gov/types/brain/patient/adult-brain-treatment-pdq . New explanations are marked review pending and do not constitute a diagnostic report.
