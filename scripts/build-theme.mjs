import fs from 'node:fs';
const css=fs.readFileSync(new URL('../app/theme.css',import.meta.url),'utf8');
const token=name=>{const value=css.match(new RegExp('--'+name+':\\s*([^;]+)'))?.[1];if(!value)throw Error('Missing theme token: '+name);return value};
fs.writeFileSync(new URL('../public/icon.svg',import.meta.url),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="${parseFloat(token('radius-card'))}" fill="${token('ink')}"/><path d="M29 13h6v16h16v6H35v16h-6V35H13v-6h16z" fill="${token('bg')}"/></svg>\n`);
