const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcDir = path.join(__dirname, 'Backend', 'src');

const files = glob.sync(`${srcDir}/**/*.entity.ts`);

for (const fullPath of files) {
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  if (content.includes(',, ManyToOne')) {
    content = content.replace(',, ManyToOne', ', ManyToOne');
    changed = true;
  }
  
  if (content.includes('import { ManyToOne } from \'typeorm\'') || content.includes(', ManyToOne')) {
    // Already has ManyToOne
  } else if (content.includes('typeorm')) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'typeorm';/m, (match, p1) => {
      return `import { ${p1.trim()}, ManyToOne } from 'typeorm';`;
    });
    changed = true;
  }

  // Remove mis-injected campusId block if any
  const injection = `
  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}`;
  if (content.includes(injection)) {
    content = content.replace(injection, '}');
    
    // Inject at the actual end of class
    content = content.replace(/}\s*$/, `
  @Column({ type: 'uuid', nullable: true })
  campusId: string;

  @ManyToOne(() => Campus)
  campus: Campus;
}
`);
    changed = true;
  }


  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${fullPath}`);
  }
}
