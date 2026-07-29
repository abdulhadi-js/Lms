const fs = require('fs');
const glob = require('glob');
const path = require('path');
const srcDir = path.join(__dirname, 'Backend', 'src');

const files = glob.sync(`${srcDir}/**/*.entity.ts`);
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.match(/from 'typeorm'/)) {
    // extract all imports from typeorm
    let typeormMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+'typeorm';/);
    if (typeormMatch) {
      let imports = typeormMatch[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
      let uniqueImports = [...new Set(imports)];
      let newImportStr = `import { ${uniqueImports.join(', ')} } from 'typeorm';`;
      content = content.replace(typeormMatch[0], newImportStr);
      fs.writeFileSync(file, content);
      console.log('Fixed', file);
    }
  }
}
