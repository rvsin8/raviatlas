'use client';
import { useEffect } from 'react';
export default function Home() { useEffect(()=>{location.replace('/explore/'+location.search)},[]); return <main className="redirect"><a href="/explore/">Open RxAtlas →</a></main>; }
