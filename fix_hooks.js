const fs = require('fs');
const path = require('path');

const layouts = [
  'admin/layout.tsx',
  'teacher/layout.tsx',
  'student/layout.tsx'
];

const basePath = path.join(__dirname, 'Frontend', 'app');

layouts.forEach(relPath => {
  const filePath = path.join(basePath, relPath);
  let content = fs.readFileSync(filePath, 'utf8');

  // We need to move `const pathname = usePathname();` above the early return.
  // The early return looks like:
  // if (isLoading || !user || user.role !== '...') { return ... }
  // We can just find `const pathname = usePathname();` and move it right below `const router = useRouter();`

  if (content.includes('const pathname = usePathname();')) {
    // Remove the original one
    content = content.replace(/\s*const pathname = usePathname\(\);/, '');
    // Insert it after useRouter
    content = content.replace('const router = useRouter();', 'const router = useRouter();\n  const pathname = usePathname();');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed hooks in ${relPath}`);
});
