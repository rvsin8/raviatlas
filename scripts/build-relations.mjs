import fs from 'node:fs';
const read=(f,k)=>JSON.parse(fs.readFileSync(`data/${f}.json`,'utf8'))[k];
const regions=read('regions','regions'),conditions=read('conditions','conditions'),drugs=read('drugs','drugs');
for(const [name,arr] of Object.entries({regions,conditions,drugs})) if(new Set(arr.map(x=>x.id)).size!==arr.length) throw new Error(`Duplicate ${name} ID`);
const rids=new Set(regions.map(r=>r.id)),dids=new Set(drugs.map(d=>d.id));
for(const c of conditions){if(c.regionIds.some(r=>!rids.has(r))||c.drugIds.some(d=>!dids.has(d)))throw Error(`Invalid reference ${c.id}`);if(!['disease','disorder','injury'].includes(c.mode))throw Error('Invalid mode');}
const relations=Object.fromEntries(drugs.map(d=>{const cs=conditions.filter(c=>c.drugIds.includes(d.id));return [d.id,{conditionIds:cs.map(c=>c.id),regionIds:[...new Set(cs.flatMap(c=>c.regionIds))]}]}));
fs.writeFileSync('data/relations.generated.json',JSON.stringify(relations,null,2)+'\n');
console.log(`Validated ${conditions.length} conditions, ${drugs.length} drugs, ${regions.length} regions; generated reverse relationships.`);
