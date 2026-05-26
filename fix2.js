const fs = require('fs');

// Fix dashboard/page.tsx - val possibly undefined
let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');
d = d.replace('doc.text(f(val),', 'doc.text(f(val ?? 0),');
fs.writeFileSync('src/app/dashboard/page.tsx', d);
console.log('dashboard/page.tsx fixed');

// Fix RehabBreakdownPanel.tsx - remaining val/v undefined issues
let r = fs.readFileSync('src/components/panels/RehabBreakdownPanel.tsx','utf8');
r = r.replace('zeroedItems.reduce((a, [, v]) => a + v, 0)', 'zeroedItems.reduce((a, [, v]) => a + (v ?? 0), 0)');
r = r.replace(/fmt\(val\)/g, 'fmt(val ?? 0)');
r = r.replace('(val / rehab.total)', '((val ?? 0) / rehab.total)');
r = r.replace('`${(val/rehab.total)*100}%`', '`${((val ?? 0)/rehab.total)*100}%`');
fs.writeFileSync('src/components/panels/RehabBreakdownPanel.tsx', r);
console.log('RehabBreakdownPanel.tsx fixed');

// Fix comparablesEngine.ts - remove beds reference
let c = fs.readFileSync('src/lib/engines/comparablesEngine.ts','utf8');
c = c.replace('const bedsNum = bedrooms || beds || 3;', 'const bedsNum = bedrooms || 3;');
fs.writeFileSync('src/lib/engines/comparablesEngine.ts', c);
console.log('comparablesEngine.ts fixed');

// Fix riskAnalyzer.ts - widen strRule type
let ra = fs.readFileSync('src/lib/engines/riskAnalyzer.ts','utf8');
ra = ra.replace(
  'if (zipCode.startsWith(prefix)) { strRule = rule; break; }',
  'if (zipCode.startsWith(prefix)) { strRule = rule as any; break; }'
);
fs.writeFileSync('src/lib/engines/riskAnalyzer.ts', ra);
console.log('riskAnalyzer.ts fixed');

console.log('Done.');
