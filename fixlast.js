const fs = require('fs');

// Fix dashboard line 489
let d = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
d = d.replace(
  "{exporting ?  Exporting...' : Export PDF'}",
  "{exporting ? 'Exporting...' : 'Export PDF'}"
);
fs.writeFileSync('src/app/dashboard/page.tsx', d, 'utf8');
console.log('dashboard fixed');

// Fix rehabEngine BOM
let r = fs.readFileSync('src/lib/engines/rehabEngine.ts', 'utf8');
if (r.charCodeAt(0) === 0xFEFF) r = r.slice(1);
r = r.replace(/[^\x00-\x7F]+/g, '--');
fs.writeFileSync('src/lib/engines/rehabEngine.ts', r, 'utf8');
console.log('rehabEngine fixed');
