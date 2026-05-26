const fs = require('fs');
let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');

// Replace entire TABS array with clean version
const oldTabs = d.match(/const TABS[\s\S]*?\];/)[0];
const newTabs = `const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'overview',  label: 'Deal Overview',      icon: '📊' },
  { id: 'rehab',     label: 'Rehab Breakdown',    icon: '🔨' },
  { id: 'strategy',  label: 'Strategy Optimizer', icon: '🎯' },
  { id: 'comps',     label: 'Comps & Risks',      icon: '🏘' },
];`;

d = d.replace(oldTabs, newTabs);
fs.writeFileSync('src/app/dashboard/page.tsx', d, 'utf8');
console.log('Done.');
