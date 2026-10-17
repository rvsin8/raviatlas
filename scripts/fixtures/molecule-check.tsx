'use client';
import {useEffect,useState} from 'react';
import MoleculeCard from '@/components/molecules/MoleculeCard';
import {useAtlasStore} from '@/store/useAtlasStore';
export default function Check(){const [id,setId]=useState('ibuprofen');useEffect(()=>{const p=new URLSearchParams(location.search),theme=p.get('theme')==='dark'?'dark':'light';setId(p.get('id')||'ibuprofen');useAtlasStore.setState({theme});document.documentElement.dataset.theme=theme},[]);return <main style={{padding:32,maxWidth:1150,margin:'auto'}}><h1 style={{marginBottom:22}}>{id.replaceAll('-',' ')}</h1><MoleculeCard id={id}/></main>}
