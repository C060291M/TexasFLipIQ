const fs = require('fs');

// Fix CompsPanel.tsx - remove 2 extra args from estimateMarketPrice
let c = fs.readFileSync('src/components/panels/CompsPanel.tsx','utf8');
c = c.replace(
  `estimateMarketPrice(
          input.zipCode,
          input.sqft,
          input.bedrooms,
          input.isWaterfront,
          input.hasPool,
        )`,
  `estimateMarketPrice(
          input.zipCode,
          input.sqft,
          input.bedrooms,
        )`
);
fs.writeFileSync('src/components/panels/CompsPanel.tsx', c);
console.log('CompsPanel.tsx fixed');

// Fix riskAnalyzer.ts - widen strRule type so comparisons work
let r = fs.readFileSync('src/lib/engines/riskAnalyzer.ts','utf8');
r = r.replace(
  "let strRule = { level:'low' as const, notes:'No known major STR restrictions. Always verify current local ordinances.' };",
  "let strRule: { level: 'high' | 'medium' | 'low'; notes: string } = { level: 'low', notes: 'No known major STR restrictions. Always verify current local ordinances.' };"
);
fs.writeFileSync('src/lib/engines/riskAnalyzer.ts', r);
console.log('riskAnalyzer.ts fixed');

console.log('Done.');
