import {rmSync} from 'node:fs';
// Raw research data is a build input, not a public application download.
rmSync('out/models/source',{recursive:true,force:true});
