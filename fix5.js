const fs = require('fs');
let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');

// Remove the bad wrapper we added at the end
const cutPoint = d.lastIndexOf('\nexport default function DashboardPage()');
if (cutPoint !== -1) d = d.slice(0, cutPoint).trimEnd() + '\n';

// Rename the original export to DashboardInner
d = d.replace(
  'export default function Dashboard()',
  'function DashboardInner()'
);

// Add correct Suspense wrapper at end
d = d.trimEnd() + `

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardInner />
    </Suspense>
  );
}
`;

fs.writeFileSync('src/app/dashboard/page.tsx', d);
console.log('Done.');
