const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../Backend/src'), function(filePath) {
  if (filePath.endsWith('.module.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only modify if it imports Module and has a @Module decorator
    if (content.includes('@Module') && !content.includes('RolesModule') && !filePath.includes('roles.module.ts') && !filePath.includes('app.module.ts')) {
      
      // Add import at the top
      content = `import { RolesModule } from '../roles/roles.module';\n` + content;
      
      // We need to inject RolesModule into the imports array.
      // Easiest heuristic:
      if (content.includes('imports: [')) {
        content = content.replace('imports: [', 'imports: [RolesModule, ');
      } else {
        content = content.replace('@Module({', '@Module({\n  imports: [RolesModule],');
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
