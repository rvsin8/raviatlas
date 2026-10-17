import json
p='data/drugs.json';d=json.load(open(p));ids={x['id'] for x in d['drugs']}
rows='''levetiracetam|Levetiracetam|Keppra|Antiseizure medicine|Binds a protein involved in neurotransmitter release to reduce abnormal seizure activity.|a699059
ofloxacin-otic|Ofloxacin otic|Floxin Otic (historical brand)|Fluoroquinolone antibiotic|Blocks bacterial enzymes needed to copy DNA, treating susceptible ear infections.|a607011
amoxicillin-clavulanate|Amoxicillin and clavulanate|Augmentin|Penicillin antibiotic / beta-lactamase inhibitor|Amoxicillin disrupts bacterial cell walls while clavulanate protects it from some bacterial resistance enzymes.|a685024
nystatin|Nystatin oral suspension|Mycostatin (historical brand)|Polyene antifungal|Binds fungal cell membranes and makes them leak, treating Candida in the mouth.|a682758
metronidazole-topical|Metronidazole topical|MetroGel;MetroCream|Topical rosacea treatment|Reduces inflammatory lesions in rosacea, although its exact mechanism in this condition is not fully established.|a682244
mupirocin|Mupirocin topical|Bactroban|Topical antibiotic|Blocks bacterial protein production to treat susceptible superficial skin infections.|a688004
methimazole|Methimazole|Tapazole|Antithyroid medicine|Inhibits thyroid hormone synthesis in an overactive thyroid gland.|a682464
apixaban|Apixaban|Eliquis|Factor Xa inhibitor|Blocks a clotting protein called factor Xa to reduce formation of blood clots.|a613032
dicloxacillin|Dicloxacillin|Dynapen (historical brand)|Penicillin antibiotic|Interferes with bacterial cell-wall formation to kill susceptible bacteria.|a685017
tamoxifen|Tamoxifen|Soltamox|Selective estrogen receptor modulator|Blocks estrogen signaling in breast tissue to slow growth of estrogen-sensitive cancer cells.|a682414
tenofovir-disoproxil|Tenofovir disoproxil fumarate|Viread|Nucleotide antiviral|Inhibits a viral enzyme needed for hepatitis B virus to copy its genetic material.|a625081
sofosbuvir-velpatasvir|Sofosbuvir and velpatasvir|Epclusa|Direct-acting antiviral combination|Blocks two hepatitis C viral proteins needed for replication.|a616034
pancrelipase|Pancrelipase|Creon;Zenpep|Pancreatic enzyme replacement|Supplies digestive enzymes that help break down fats, proteins and carbohydrates.|a604035
alendronate|Alendronate|Fosamax;Binosto|Bisphosphonate|Slows the activity of bone-resorbing cells to reduce bone loss.|a601011
baclofen|Baclofen|Lioresal;Fleqsuvy|Antispasticity medicine|Activates GABA-B receptors in the spinal cord to reduce excessive muscle activity.|a682530
colchicine|Colchicine|Colcrys;Mitigare|Anti-inflammatory gout medicine|Disrupts microtubules in inflammatory cells to reduce the response to urate crystals.|a682711'''
for line in rows.splitlines():
 id,generic,brands,cls,mech,source=line.split('|')
 if id not in ids:d['drugs'].append({'id':id,'generic':generic,'brands':brands.split(';'),'drugClass':cls,'mechanism':mech,'rxStatus':'Rx','_review':'pending','source':'https://medlineplus.gov/druginfo/meds/'+source+'.html'})
json.dump(d,open(p,'w'),indent=2)
p='data/conditions.json';c=json.load(open(p))
for x in c['conditions']:
 if x['id']=='acute-appendicitis':x['nonDrugTreatments']=[s for s in x['nonDrugTreatments'] if 'antibiotics' not in s]
json.dump(c,open(p,'w'),indent=2)
