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

  // 1. Add imports
  if (!content.includes('useAuth')) {
    content = content.replace(
      'import { usePathname } from \'next/navigation\';',
      'import { usePathname, useRouter } from \'next/navigation\';\nimport { useAuth } from \'@/lib/auth-context\';\nimport { useEffect } from \'react\';'
    );
  }

  // 2. Add auth hook logic
  const role = relPath.split('/')[0].toUpperCase(); // ADMIN, TEACHER, STUDENT
  const componentMatch = content.match(/export default function \w+Layout\([^)]+\)\s*\{/);
  
  if (componentMatch && !content.includes('const { user, isLoading, logout }')) {
    const injection = `
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== '${role}') {
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== '${role}') {
    return <div className="flex h-screen items-center justify-center bg-page-bg text-evergreen">Loading...</div>;
  }
`;
    content = content.replace(componentMatch[0], componentMatch[0] + injection);
  }

  // 3. Fix Logout button
  // It usually looks like:
  // <Link href="/" className="...">
  //   <LogOut className="w-5 h-5" />
  //   <span>Logout</span>
  // </Link>
  content = content.replace(
    /<Link href="\/[^"]*"([^>]*)>\s*<LogOut([^>]*)>\s*<span>Logout<\/span>\s*<\/Link>/g,
    '<button onClick={() => logout()}$1>\n            <LogOut$2>\n            <span>Logout</span>\n          </button>'
  );
  
  // There might be another logout for mobile navigation at the bottom
  content = content.replace(
    /<Link href="\/[^"]*"([^>]*)>\s*<LogOut([^>]*)>\s*<span([^>]*)>Logout<\/span>\s*<\/Link>/g,
    '<button onClick={() => logout()}$1>\n            <LogOut$2>\n            <span$3>Logout</span>\n          </button>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${relPath}`);
});
