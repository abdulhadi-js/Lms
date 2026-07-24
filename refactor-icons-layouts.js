const fs = require('fs');
const path = require('path');

const filePaths = [
  'app/teacher/layout.tsx',
  'app/student/layout.tsx'
];

const iconMap = {
  'menu': 'Menu',
  'notifications': 'Bell',
  'settings': 'Settings',
  'arrow_forward': 'ArrowRight',
  'edit_square': 'Edit',
  'fact_check': 'ClipboardCheck',
  'forum': 'MessageSquare',
  'upload_file': 'Upload',
  'location_on': 'MapPin',
  'group': 'Users',
  'more_horiz': 'MoreHorizontal',
  'file_download': 'Download',
  'school': 'GraduationCap',
  'logout': 'LogOut',
  'dashboard': 'LayoutDashboard',
  'assignment': 'FileText',
  'military_tech': 'Award',
  'calendar_today': 'Calendar',
  'payments': 'CreditCard',
  'analytics': 'BarChart3'
};

filePaths.forEach(relPath => {
  const fullPath = path.join(__dirname, 'frontend', relPath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let iconsToImport = new Set();
  
  content = content.replace(/<span[^>]*className="[^"]*material-symbols-outlined[^"]*"[^>]*>\s*([a-z_]+)\s*<\/span>/g, (match, iconName) => {
    const lucideName = iconMap[iconName];
    if (lucideName) {
      iconsToImport.add(lucideName);
      let classes = match.match(/className="([^"]+)"/);
      let classNameStr = '';
      if (classes) {
        let cleanedClasses = classes[1]
          .replace('material-symbols-outlined', '')
          .replace(/text-\[\d+px\]/, '')
          .trim();
        if (cleanedClasses) {
          classNameStr = ` className="${cleanedClasses} w-5 h-5"`;
        } else {
          classNameStr = ` className="w-5 h-5"`;
        }
      }
      return `<${lucideName}${classNameStr} />`;
    }
    return match;
  });

  if (iconsToImport.size > 0) {
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"];/;
    const existingImport = content.match(importRegex);
    if (existingImport) {
      const existingIcons = existingImport[1].split(',').map(s => s.trim());
      iconsToImport.forEach(i => {
        if (!existingIcons.includes(i)) existingIcons.push(i);
      });
      content = content.replace(importRegex, `import { ${existingIcons.join(', ')} } from 'lucide-react';`);
    } else {
      content = `import { ${Array.from(iconsToImport).join(', ')} } from 'lucide-react';\n` + content;
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${relPath}`);
  }
});
