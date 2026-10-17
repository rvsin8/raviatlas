# Ten Powers · One Pill — sources and credits

Educational content is pending human review. The person is fictional. This is not medical advice or a tracked physical bottle.

## Anatomy
BodyParts3D © DBCLS, CC BY 4.0 (license updated 2025-02-27).
Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
License statement: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
License: https://creativecommons.org/licenses/by/4.0/
Releases 4.0 and 4.3 (thyroid). The body asset was copied unchanged from the recovered RxAtlas checkpoint. Its real heart node was extracted, with transforms retained. No primitive anatomy was made. The adult male model is a reference, not a patient. Cell geometry is unavailable and explicitly marked missing.

## Molecular structures
RCSB PDB 4AMJ, https://www.rcsb.org/structure/4AMJ
Warne et al. (2012), Crystal Structures of a Stabilized Beta1-Adrenoceptor Bound to the Biased Agonists Bucindolol and Carvedilol. https://doi.org/10.1016/j.str.2012.03.014
Engineered turkey beta-1 receptor, chain A, and bound CVD (S-carvedilol). PDB data are openly accessible under the wwPDB data policy: https://www.wwpdb.org/about/usage-policies
Only chain A protein and ligand are displayed. Binding approach is illustrative; deposited coordinates define the final pose.
PubChem CID 2585: https://pubchem.ncbi.nlm.nih.gov/compound/2585
The static SDF conformer is carvedilol, distinct from the receptor-bound S-enantiomer pose.

## Maps
Earth texture: NASA Blue Marble, via three-globe’s example texture, https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg
NASA image usage guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/
Queens aerial orthoimagery: USGS National Map / USDA NAIP, public domain. https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer
The image is aerial photography, not a satellite acquisition.
Address locations: US Census geocoder. Exported responses and imagery extent are included in /data. City reference points and attribution are in /data/coordinates.json. Hyderabad coordinates: GeoNames (CC BY), https://www.geonames.org/1269843/hyderabad.html . Pennington: LatLong.net, https://www.latlong.net/place/pennington-nj-usa-28897.html . Pins are not verified factory locations.

## Label evidence
Aurobindo carvedilol 25 mg, 100 tablets, NDC 65862-145-01:
https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7cc14b86-0833-4c3c-91f3-7963d7052fd5
Zydus carvedilol 25 mg, 100 tablets, NDC 68382-095-01:
https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=dc6a2d33-aa04-4a04-9cde-901b744d24ca
CVS destination: https://www.cvs.com/store-locator/jamaica-ny-pharmacies/178-02-hillside-ave-jamaica-ny-11432/storeid%3D2718
Manufacturer and distributor statements are label facts. No shipment leg, API supplier, wholesaler, or receipt at this pharmacy is verified. All arcs are illustrative. Strength is product identification, not dosing guidance.
API site counts and shortage history are unavailable; empty records never mean zero sites or no shortages.

## Fonts and software
Inter and JetBrains Mono, SIL Open Font License; license files in /assets.
Three.js and react-globe.gl: MIT. 3Dmol.js: BSD 3-Clause. React: MIT. Dependency notices included in the source repository.
No Web Workers are created by application code. 3Dmol surfaces (which can use workers) are not used.

Country boundaries for optional verified-count heatmaps: Natural Earth, public domain, https://www.naturalearthdata.com/about/terms-of-use/ . No country is shaded without a supplied, finite drug-specific count.
Roboto Condensed by the Roboto Project Authors, SIL Open Font License, from https://github.com/google/fonts/tree/main/ofl/robotocondensed .
