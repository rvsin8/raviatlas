import {themeToken} from '@/lib/theme';
import type {RDKit,GroupMatch,Molecule} from './types';
const table:Record<number,[string,string,number,string,string]>={1:['H','Hydrogen',1.2,'--cpk-1-0','--cpk-1-1'],6:['C','Carbon',1.7,'--cpk-6-0','--cpk-6-1'],7:['N','Nitrogen',1.55,'--cpk-7-0','--cpk-7-1'],8:['O','Oxygen',1.52,'--cpk-8-0','--cpk-8-1'],9:['F','Fluorine',1.47,'--cpk-9-0','--cpk-9-1'],15:['P','Phosphorus',1.8,'--cpk-15-0','--cpk-15-1'],16:['S','Sulfur',1.8,'--cpk-16-0','--cpk-16-1'],17:['Cl','Chlorine',1.75,'--cpk-17-0','--cpk-17-1'],26:['Fe','Iron',1.8,'--cpk-26-0','--cpk-26-1'],11:['Na','Sodium',2.27,'--cpk-11-0','--cpk-11-1'],19:['K','Potassium',2.75,'--cpk-19-0','--cpk-19-1'],35:['Br','Bromine',1.85,'--cpk-35-0','--cpk-35-1'],53:['I','Iodine',1.98,'--cpk-53-0','--cpk-53-1'],5:['B','Boron',1.92,'--cpk-5-0','--cpk-5-1'],12:['Mg','Magnesium',1.73,'--cpk-12-0','--cpk-12-1'],14:['Si','Silicon',2.1,'--cpk-14-0','--cpk-14-1'],20:['Ca','Calcium',2.31,'--cpk-20-0','--cpk-20-1'],30:['Zn','Zinc',1.39,'--cpk-30-0','--cpk-30-1']};
export function element(z:number,dark=false){const t=table[z]||['?','Element '+z,1.8,'--cpk-other-0','--cpk-other-1'];return {symbol:t[0],name:t[1],radius:t[2],color:themeToken(t[dark?4:3] as string)};}
export const groupDefinitions=[
 ['Carboxylic acid','[CX3](=O)[OX2H1]','A carbonyl and hydroxyl attached to the same carbon.'],
 ['Hydroxyl','[OX2H1;!$([O][CX3]=O)]','An oxygen–hydrogen group attached to another atom.'],
 ['Amine','[NX3;!$(N[C,S,P]=[O,S,N]);!$(N=O)]','A nitrogen bonded to carbon or hydrogen, outside an amide.'],
 ['Amide','[NX3][CX3](=[OX1])','A nitrogen attached directly to a carbonyl carbon.'],
 ['Ester','[CX3](=[OX1])[OX2H0][#6]','A carbonyl linked to carbon through an oxygen.'],
 ['Ether','[#6;!$(C=O)][OX2H0][#6;!$(C=O)]','An oxygen linking two carbon groups.'],
 ['Aromatic ring','[a;r]','A ring with a delocalized system of electrons.'],
 ['Ketone','[#6][CX3](=[OX1])[#6]','A carbonyl carbon bonded to two carbon groups.'],
 ['Halogen','[F,Cl,Br,I]','A fluorine, chlorine, bromine, or iodine atom.'],
 ['Sulfonamide','[SX4](=[OX1])(=[OX1])[NX3]','A nitrogen attached to a sulfonyl group.'],
 ['Nitro','[N+](=[O])[O-]','A nitrogen–oxygen group commonly written as –NO₂.']
] as const;
export function detectGroups(R:RDKit,mol:ReturnType<RDKit['get_mol']>):GroupMatch[]{if(!mol)return [];return groupDefinitions.flatMap(([name,smarts,description])=>{const q=R.get_qmol(smarts);if(!q)return [];try{const matches=JSON.parse(mol.get_substruct_matches(q)) as {atoms:number[]}[];const atoms=[...new Set((Array.isArray(matches)?matches:[]).flatMap(x=>x.atoms))];return atoms.length?[{name,description,atoms}]:[]}finally{q.delete()}})}
export function formulaParts(formula:string){return [...formula.matchAll(/([A-Z][a-z]?)(\d*)/g)].map(m=>({symbol:m[1],count:Number(m[2]||1)}));}
export function bondCount(m:Molecule,i:number){return (m.bonds||[]).filter(b=>b.a===i||b.b===i).length+(m.atoms?.[i]?.implicitH||0);}
let promise:Promise<RDKit>|undefined;
export function loadRDKit(){return promise??=new Promise<RDKit>((resolve,reject)=>{const script=document.createElement('script');script.src='/vendor/rdkit/RDKit_minimal.js';script.onload=()=>{const init=(window as unknown as {initRDKitModule:(o:unknown)=>Promise<RDKit>}).initRDKitModule;init({locateFile:(f:string)=>'/vendor/rdkit/'+f}).then(resolve,reject)};script.onerror=()=>reject(Error('The local chemistry engine could not load.'));document.head.appendChild(script)});}
