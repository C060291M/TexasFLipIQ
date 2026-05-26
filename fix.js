const fs = require('fs');

let f = fs.readFileSync('src/lib/engines/rehabEngine.ts','utf8');
f = f.replace('Object.values(lineItems).reduce((a, b) => a + b, 0)', 'Object.values(lineItems).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)');
f = f.replace('Math.round(total),', 'Math.round(total ?? 0),');
f = f.replace('Math.round(total / sqft)', 'Math.round((total ?? 0) / sqft)');
fs.writeFileSync('src/lib/engines/rehabEngine.ts', f);
console.log('rehabEngine.ts fixed');

let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');
d = d.replace('.reduce((a: number, b: number) => a + (b ?? 0), 0)', '.reduce((a: number, b: number | undefined) => a + (b ?? 0), 0)');
d = d.replace('Math.round(total),', 'Math.round(total ?? 0),');
d = d.replace('Math.round(total / input.sqft)', 'Math.round((total ?? 0) / input.sqft)');
d = d.replace('.filter(([, v]) => v > 0)', '.filter(([, v]) => (v ?? 0) > 0)');
d = d.replace('.sort((a, b) => b[1] - a[1])', '.sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))');
fs.writeFileSync('src/app/dashboard/page.tsx', d);
console.log('dashboard/page.tsx fixed');

let r = fs.readFileSync('src/components/panels/RehabBreakdownPanel.tsx','utf8');
r = r.replace('.filter(([, v]) => v > 0)', '.filter(([, v]) => (v ?? 0) > 0)');
r = r.replace('.reduce((a, [, v]) => a + v, 0)', '.reduce((a, [, v]) => a + (v ?? 0), 0)');
fs.writeFileSync('src/components/panels/RehabBreakdownPanel.tsx', r);
console.log('RehabBreakdownPanel.tsx fixed');

let c = fs.readFileSync('src/lib/engines/comparablesEngine.ts','utf8');
c = c.replace('sqft, beds, bathrooms, zipCode, yearBuilt, exitStrategy, arv, bedrooms', 'sqft, bathrooms, zipCode, yearBuilt, exitStrategy, arv, bedrooms');
fs.writeFileSync('src/lib/engines/comparablesEngine.ts', c);
console.log('comparablesEngine.ts fixed');

console.log('All done.');
