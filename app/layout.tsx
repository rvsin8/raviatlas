import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'RxAtlas — Anatomy meets pharmacology', description: 'An interactive educational atlas connecting body regions, conditions, and treatments.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
