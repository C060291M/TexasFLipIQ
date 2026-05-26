const fs = require('fs');
let lines = fs.readFileSync('src/app/dashboard/page.tsx','utf8').split('\n');

lines[468] = lines[468].replace(/ðŸ".*?\{addressLine\}/, '📍 {addressLine}');
lines[488] = lines[488].replace(/â³ Exporting\.\.\./, '⏳ Exporting...').replace(/ðŸ"„ Export PDF/, '📄 Export PDF');
lines[493] = lines[493].replace(/ðŸ\s+Send to CRM/, '🏠 Send to CRM');

fs.writeFileSync('src/app/dashboard/page.tsx', lines.join('\n'), 'utf8');
console.log('Done.');
