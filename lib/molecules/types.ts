export type Atom={index:number;z:number;position:number[];implicitH:number;charge:number};
export type Bond={a:number;b:number;order:number;aromatic:boolean};
export type Residue={residue:number;position:number[];type:'helix'|'sheet'|'loop'};
export type Molecule={id:string;name:string;kind:'small'|'protein'|'combination'|'unavailable';cid?:number;dimension?:number;formula?:string;molecularWeight?:string;iupacName?:string;canonicalSmiles?:string;isomericSmiles?:string;smilesToSdfAtomIndices?:number[];depictionMolblock?:string;sdfUrl?:string;sourceUrl?:string;note?:string;reason?:string;atoms?:Atom[];bonds?:Bond[];components?:string[];pdbId?:string;pdbUrl?:string;proteinType?:string;chainCount?:number;residueCount?:number;chains?:{id:string;residues:Residue[]}[]};
export type GroupMatch={name:string;description:string;atoms:number[]};
export type JSMol={delete:()=>void;get_svg_with_highlights:(s:string)=>string;get_substruct_matches:(m:JSMol)=>string};
export type RDKit={get_mol:(s:string,opts?:string)=>JSMol|null;get_qmol:(s:string)=>JSMol|null};
