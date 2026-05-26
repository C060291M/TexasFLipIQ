const fs = require('fs');
let r = fs.readFileSync('src/lib/engines/rehabEngine.ts', 'utf8');
// Remove BOM and any leading non-import characters
r = r.replace(/^[^i]+/, '');
fs.writeFileSync('src/lib/engines/rehabEngine.ts', r, 'utf8');
console.log('Done.');
