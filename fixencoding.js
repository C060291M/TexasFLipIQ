const fs = require('fs');

const files = [
  'src/app/dashboard/page.tsx',
  'src/lib/engines/rehabEngine.ts',
];

const replacements = [
  ['ðŸ"Š', '📊'],
  ['ðŸ"¨', '🔨'],
  ['ðŸŽ¯', '🎯'],
  ['ðŸ˜', '🏘'],
  ['ðŸ"', '📍'],
  ['ðŸš¨', '🚨'],
  ['â³', '⏳'],
  ['ðŸ"„', '📄'],
  ['ðŸ ', '🏠'],
  ['âš ', '⚠️'],
  ['â€"', '—'],
  ['â€™', "'"],
  ['â€œ', '"'],
  ['â€', '"'],
];

for (const file of files) {
  let content = fs.readFileSync(file, 'latin1');
  for (const [bad, good] of replacements) {
    content = content.split(bad).join(good);
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed: ' + file);
}
console.log('All done.');
