const fs = require('fs');
let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');
d = d.replace("icon: 'ðŸ\"Š'", "icon: '📊'");
d = d.replace("icon: 'ðŸ\"¨'", "icon: '🔨'");
d = d.replace("icon: 'ðŸŽ¯'", "icon: '🎯'");
d = d.replace("icon: 'ðŸ˜'", "icon: '🏘'");
fs.writeFileSync('src/app/dashboard/page.tsx', d, 'utf8');
console.log('Done.');
