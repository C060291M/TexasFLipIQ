const fs = require('fs');
let d = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Replace broken emoji sequences in header buttons
d = d.replace(/[^\x00-\x7F]+\s*2 critical/, '🚨 2 critical');
d = d.replace(/[^\x00-\x7F]+\s*1 warnings/, '⚠ 1 warnings');
d = d.replace(/[^\x00-\x7F]+\s*Export PDF/, 'Export PDF');
d = d.replace(/[^\x00-\x7F]+\s*Send to CRM/, 'Send to CRM');
d = d.replace(/[^\x00-\x7F]+\s*Deal Overview/, 'Deal Overview');
d = d.replace(/[^\x00-\x7F]+\s*Rehab Breakdown/, 'Rehab Breakdown');
d = d.replace(/[^\x00-\x7F]+\s*Strategy Optimizer/, 'Strategy Optimizer');
d = d.replace(/[^\x00-\x7F]+\s*Comps & Risks/, 'Comps & Risks');

// Strip ALL remaining non-ASCII
d = d.replace(/[^\x00-\x7F]+/g, '');

fs.writeFileSync('src/app/dashboard/page.tsx', d, 'utf8');
console.log('Done.');
