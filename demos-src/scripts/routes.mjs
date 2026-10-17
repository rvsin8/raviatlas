import fs from'node:fs';for(const name of['one-pill','ten-powers']){fs.mkdirSync('dist/'+name,{recursive:true});fs.copyFileSync('dist/index.html','dist/'+name+'/index.html')}
