const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Frontend', 'app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if "use client" is not at the top but exists
    if (content.includes('"use client";') && !content.startsWith('"use client";')) {
      content = content.replace(/"use client";\n?/g, '');
      content = '"use client";\n' + content;
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed use client in ${path.basename(filePath)}`);
    }
  }
});
