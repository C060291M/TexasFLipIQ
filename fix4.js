const fs = require('fs');
let d = fs.readFileSync('src/app/dashboard/page.tsx','utf8');

// Add Suspense to the import
d = d.replace(
  "import { useState, useMemo, useCallback, useEffect } from 'react';",
  "import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';"
);

// Rename the main export function and add a Suspense wrapper
d = d.replace(
  'export default function DashboardPage()',
  'function DashboardInner()'
);

// Add Suspense wrapper at the end of the file
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
