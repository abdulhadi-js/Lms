const fs = require('fs');
const path = require('path');

function traverse(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  for(const item of items) {
    const full = path.join(dir, item);
    if(fs.statSync(full).isDirectory()) files.push(...traverse(full));
    else if(full.endsWith('.ts')) files.push(full);
  }
  return files;
}

const files = traverse('src');
let changed = 0;
for(const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let newContent = content;
  
  // Remove simple throw lines
  newContent = newContent.replace(/^\s*if\s*\(\!req\.user\?\.permissions\?\.includes\('.*?'\)\s*\&\&\s*\!req\.user\?\.isSuperAdmin\)\s*throw new ForbiddenException\(\);\r?\n/gm, '');
  
  newContent = newContent.replace(/^\s*if\s*\(\!currentUser\.permissions\?\.includes\('.*?'\)\s*\&\&\s*\!currentUser\.isSuperAdmin\)\s*\{\r?\n\s*throw new ForbiddenException\(.*?\);\r?\n\s*\}\r?\n/gm, '');
  
  // Enrollment controller specific one
  newContent = newContent.replace(/^\s*if\s*\(req\.user\?\.permissions\?\.includes\('MANAGE_ENROLLMENTS'\)\s*\|\|\s*req\.user\?\.isSuperAdmin\)\s*\{\r?\n\s*return this\.enrollmentsService\.adminDrop\(dto\.enrollmentId,\s*dto\.reason,\s*req\.user\);\r?\n\s*\}/gm, 
  'if ((req.user?.matrix && req.user.matrix.some(m => m.moduleId === "ADMISSIONS" && m.canEdit)) || req.user?.isSuperAdmin) { return this.enrollmentsService.adminDrop(dto.enrollmentId, dto.reason, req.user); }');

  // assignment service:
  newContent = newContent.replace(/currentUser\.permissions\?\.includes\('MANAGE_ASSIGNMENTS'\)/g, "currentUser.matrix?.some(m => m.moduleId === 'EXAMS' && m.canEdit)");

  // fee service:
  newContent = newContent.replace(/currentUser\.permissions\?\.includes\('MANAGE_FEES'\)/g, "currentUser.matrix?.some(m => m.moduleId === 'FEES' && m.canEdit)");

  // marks service:
  newContent = newContent.replace(/currentUser\.permissions\?\.includes\('MANAGE_MARKS'\)/g, "currentUser.matrix?.some(m => m.moduleId === 'EXAMS' && m.canEdit)");

  if (newContent !== content) {
    fs.writeFileSync(f, newContent);
    changed++;
    console.log('Fixed', f);
  }
}
console.log('Total fixed:', changed);
