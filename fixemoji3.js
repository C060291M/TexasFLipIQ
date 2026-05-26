const fs = require('fs');
let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');

d = d.replace(/ðŸ"[\s]/g, '📍 ');
d = d.replace('ðŸš¨', '🚨');
d = d.replace('â³ Exporting...', '⏳ Exporting...');
d = d.replace('ðŸ"„ Export PDF', '📄 Export PDF');
d = d.replace('ðŸ  Send to CRM', '🏠 Send to CRM');

fs.writeFileSync('src/app/dashboard/page.tsx', d, 'utf8');
console.log('Done.');
