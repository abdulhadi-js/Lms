const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.entity.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("type: 'datetime'")) {
        content = content.replace(/type: 'datetime'/g, "type: 'timestamp'");
        fs.writeFileSync(fullPath, content);
        console.log('Fixed datetime to timestamp in ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
