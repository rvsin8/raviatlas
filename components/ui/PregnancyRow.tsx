import {useAtlasStore} from '@/store/useAtlasStore';
import type {Drug} from '@/lib/types';
export default function PregnancyRow({drug}:{drug:Drug}){const body=useAtlasStore(s=>s.body),p=drug.pregnancy_lactation;if(body!=='female'||!p)return null;return <details className="sex-callout pregnancy-row"><summary>Pregnancy & breastfeeding</summary><p>{p.pregnancy}</p><p>{p.lactation}</p><a href={p.label} target="_blank" rel="noreferrer">FDA label · Pregnancy and lactation sections</a><small>Human review pending</small></details>}
