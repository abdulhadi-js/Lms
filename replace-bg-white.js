const fs = require('fs');
const path = require('path');

function replaceBgWhite(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceBgWhite(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Only replace 'bg-white' when followed by word boundary or space/quote, but not when it's bg-white/20 etc
            const newContent = content.replace(/(?<![\w-])bg-white(?!\/)(?![\w-])/g, 'bg-surface');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceBgWhite('Frontend/app/teacher');
replaceBgWhite('Frontend/app/student');
