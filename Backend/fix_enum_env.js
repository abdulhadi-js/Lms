const fs = require('fs');
const path = require('path');

const files = [
  'src/exams/entities/exam.entity.ts',
  'src/fees/entities/fee.entity.ts',
  'src/finance/entities/transaction.entity.ts',
  'src/messaging/entities/message-outbox.entity.ts',
  'src/roles/entities/module-permission.entity.ts'
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace `@Column({ type: 'varchar', enum: SomeEnum })`
    // with `@Column({ type: process.env.NODE_ENV === 'production' ? 'enum' : 'varchar', enum: SomeEnum })`
    content = content.replace(/type:\s*'varchar'(,\s*enum:)/g, "type: process.env.NODE_ENV === 'production' ? 'enum' : 'varchar'$1");
    
    // For module-permission.entity.ts where I manually stripped enum: ModuleId
    if (file.includes('module-permission.entity.ts')) {
      content = content.replace(/type:\s*'varchar'\s*}\)/g, "type: process.env.NODE_ENV === 'production' ? 'enum' : 'varchar', enum: ModuleId })");
    }
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed environment-aware enum in ' + fullPath);
  }
}
