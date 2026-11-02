import Link from 'next/link';
import {ArrowLeft,Plus} from 'lucide-react';
export default function DemoHeader({title}:{title?:string}){return <header className="demo-header"><Link href="/explore/" className="brand"><span className="brand-icon"><Plus size={22}/></span>Rx<span>Atlas</span></Link><nav aria-label="Demo navigation"><Link href="/explore/"><ArrowLeft size={14}/> Body map</Link><Link href="/demos/" aria-current={!title?'page':undefined}>Demos</Link>{title&&<span className="demo-current">{title}</span>}</nav><span className="demo-header-note">Interactive learning lab</span></header>}
