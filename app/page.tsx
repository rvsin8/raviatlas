'use client'
import { useMemo,useState } from 'react'
import dynamic from 'next/dynamic'
import { regions,entries } from '../data/regions'
const BodyViewer=dynamic(()=>import('../components/BodyViewer'),{ssr:false})
export default function Page(){
 const [selected,setSelected]=useState('chest')
 const [query,setQuery]=useState('')
 const region=regions.find(r=>r.id===selected)!
 const matches=useMemo(()=>query.trim()?entries.filter(e=>(e.name+' '+e.kind+' '+e.text).toLowerCase().includes(query.toLowerCase())):entries.filter(e=>e.region===selected||e.region==='systemic'),[query,selected])
 return <div className="app">
  <header className="header"><div className="brand"><span className="plus">＋</span><span>RxAtlas</span><sup>β</sup></div><label className="search">⌕<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search conditions or drugs"/><kbd>⌘ K</kbd></label><button className="theme">◔</button></header>
  <main className="split">
   <section className="mapPanel">
    <div className="eyebrow">INTERACTIVE BODY MAP</div>
    <div className="filters"><button className="active"><i/>Disease</button><button><i/>Disorder</button><button><i/>Injury</button><span>ⓘ</span></div>
    <div className="bodyline"><span>Body</span><span>☷ &nbsp; Browse regions⌄</span></div>
    <div className="vertical">HUMAN ANATOMY &nbsp;&nbsp;&nbsp; BODYPARTS3D</div>
    <BodyViewer/>
    <div className="helper"><b>A new way to see the connections</b><span>Select a body region to begin exploring</span></div>
    <div className="viewControls"><button>◇ &nbsp; Skin layer <span className="switch"/></button><button>↶</button></div>
    <div className="drag">✥ &nbsp; Drag to rotate &nbsp;·&nbsp; Scroll to zoom</div><div className="systemic">◎ &nbsp; Whole body / Systemic</div>
   </section>
   <section className="explore">
    <div className="topline"><span className="eyebrow">EXPLORE THE ATLAS</span><span className="preview">Preview edition</span></div>
    <div className="hero"><span>THE HUMAN BODY, CONNECTED</span><h1>Anatomy meets<br/><em>pharmacology</em></h1><p>Explore a region. Understand a condition.<br/>Discover how treatments work.</p></div>
    <div className="regionHead"><b>Where would you like to explore?</b><span>10 regions</span></div>
    <div className="regions">{regions.map((r,i)=><button onClick={()=>{setSelected(r.id);setQuery('')}} className={selected===r.id?'region active':'region'} key={r.id}><span><small>{String(i+1).padStart(2,'0')}</small>{r.name}</span><b>›</b></button>)}</div>
    <div className="details"><div><span className="eyebrow">SELECTED REGION</span><h2>{region.name}</h2><p>{region.description}</p><div className="pills">{region.subregions.map(s=><span key={s}>{s}</span>)}</div>{selected==='chest'&&<aside>Breast — no separate 3D geometry in this model.</aside>}{selected==='neck'&&<aside>Thyroid geometry should use verified BodyParts3D thyroid-gland geometry, not thyroid cartilage.</aside>}</div><div className="results"><span className="eyebrow">{query?'SEARCH RESULTS':'CONDITIONS & DRUGS'}</span>{matches.map(e=><article key={e.name}><small>{e.kind}</small><b>{e.name}</b><p>{e.text}</p></article>)}</div></div>
   </section>
  </main>
  <footer><span>◉ &nbsp; For educational purposes only. Not medical advice. Consult a licensed healthcare provider.</span><span>BodyParts3D © DBCLS · CC BY 4.0 &nbsp;&nbsp; RxAtlas / v1.0</span></footer>
 </div>
}