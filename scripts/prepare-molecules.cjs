const fs=require('fs'),path=require('path');
const init=require('@rdkit/rdkit');
fs.mkdirSync('public/vendor/rdkit',{recursive:true});for(const f of ['RDKit_minimal.js','RDKit_minimal.wasm'])fs.copyFileSync('node_modules/@rdkit/rdkit/dist/'+f,'public/vendor/rdkit/'+f);
(async()=>{const R=await init();const report={ready:[],missing:[],fallback2D:[]};for(const file of fs.readdirSync('data/molecules').filter(f=>f.endsWith('.json')&&f!=='build-report.json')){const p='data/molecules/'+file,d=JSON.parse(fs.readFileSync(p));if(!d.id)continue;try{
 if(d.kind==='small'){
  const sdf=fs.readFileSync('public'+d.sdfUrl,'utf8');const mol=R.get_mol(sdf,JSON.stringify({removeHs:false}));if(!mol?.is_valid())throw Error('RDKit could not parse source SDF');
  const sourceAtomCount=mol.get_num_atoms();if(d.dimension===2){mol.add_hs_in_place();mol.set_new_coords();}
  const raw=JSON.parse(mol.get_json()),m=raw.molecules[0],def=raw.defaults,coords=m.conformers?.[0]?.coords;if(!coords)throw Error('Source coordinates missing');
  const ext=m.extensions?.find(e=>e.name==='rdkitRepresentation');
  d.atoms=m.atoms.map((a,i)=>({index:i,sdfAtomIndex:i<sourceAtomCount?i:null,z:a.z??def.atom.z,position:coords[i],implicitH:a.impHs??0,charge:a.chg??0}));
  d.bonds=m.bonds.map((b,i)=>({a:b.atoms[0],b:b.atoms[1],order:b.bo??1,aromatic:ext?.aromaticBonds?.includes(i)||false}));
  const smiles=R.get_mol(d.isomericSmiles||d.canonicalSmiles);const match=smiles?JSON.parse(mol.get_substruct_match(smiles)):null;d.smilesToSdfAtomIndices=match?.atoms||[];if(smiles)smiles.delete();
  if(!d.smilesToSdfAtomIndices.length)throw Error('Could not verify SMILES-to-SDF atom mapping');
  // Depiction changes 2D layout only. Source 3D positions above remain untouched.
  mol.set_new_coords();d.depictionMolblock=mol.get_molblock();mol.delete();
  if(d.dimension===2)report.fallback2D.push(d.id);
 }else if(d.kind==='protein'){
  const lines=fs.readFileSync('public'+d.pdbUrl,'utf8').split('\n'),ranges=[];
  for(const l of lines){if(l.startsWith('HELIX '))ranges.push({chain:l.slice(19,20),start:+l.slice(21,25),end:+l.slice(33,37),type:'helix'});if(l.startsWith('SHEET '))ranges.push({chain:l.slice(21,22),start:+l.slice(22,26),end:+l.slice(33,37),type:'sheet'});}
  const chains={};for(const l of lines){if(l.startsWith('ENDMDL'))break;if(!l.startsWith('ATOM  ')||l.slice(12,16).trim()!=='CA'||![' ','A'].includes(l[16]))continue;const chain=l[21],res=+l.slice(22,26);(chains[chain]??=[]).push({residue:res,position:[+l.slice(30,38),+l.slice(38,46),+l.slice(46,54)],type:ranges.find(r=>r.chain===chain&&res>=r.start&&res<=r.end)?.type||'loop'});}
  d.chains=Object.entries(chains).map(([id,residues])=>({id,residues}));d.chainCount=d.chains.length;d.residueCount=d.chains.reduce((n,c)=>n+c.residues.length,0);if(!d.residueCount)throw Error('No deposited CA backbone coordinates');
 }else if(d.kind==='unavailable'){report.missing.push({id:d.id,reason:d.reason});}
 fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');fs.copyFileSync(p,'public/molecules/'+file);report.ready.push(d.id);
 }catch(e){report.missing.push({id:d.id,reason:e.message});console.error(d.id,e.message);}}
 fs.writeFileSync('data/molecules/structure-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));})();
