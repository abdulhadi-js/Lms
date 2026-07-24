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

// 1. Inject Toaster into layout.tsx
const layoutPath = path.join(srcDir, 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  if (!layoutContent.includes('Toaster')) {
    layoutContent = layoutContent.replace(/import \{ AuthProvider \}/, "import { Toaster } from 'react-hot-toast';\nimport { AuthProvider }");
    // Insert <Toaster position="top-right" /> right before {children}
    layoutContent = layoutContent.replace(/\{children\}/, "<Toaster position=\"top-right\" />\n        {children}");
    fs.writeFileSync(layoutPath, layoutContent, 'utf8');
    console.log('Injected Toaster into layout.tsx');
  }
}

// 2. Replace alert() with toast() across all TSX files
walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if the file contains alert(
    if (content.includes('alert(')) {
      // Add import { toast } from 'react-hot-toast'; at the top if it doesn't exist
      if (!content.includes('react-hot-toast')) {
        content = "import { toast } from 'react-hot-toast';\n" + content;
      }
      
      // Replace alert('Failed...'), alert('Error...'), etc with toast.error()
      // Replace alert('Success...'), alert('Approved...'), etc with toast.success()
      // Everything else default to toast()
      
      content = content.replace(/alert\((.*(?:Fail|Error|err).*)\)/gi, 'toast.error($1)');
      content = content.replace(/alert\((.*(?:Success|Approv|Creat|Updat|Delet|Enrolled|Withdraw|Drop|Subm).*)\)/gi, 'toast.success($1)');
      content = content.replace(/alert\(/g, 'toast(');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Replaced alerts in ${path.basename(filePath)}`);
    }
  }
});

console.log('Finished replacing alerts.');
