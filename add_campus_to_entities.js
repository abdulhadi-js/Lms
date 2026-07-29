const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcDir = path.join(__dirname, 'Backend', 'src');

const targetEntities = [
  'academics/entities/academic-class.entity.ts',
  'academics/entities/section.entity.ts',
  'academics/entities/subject.entity.ts',
  'academics/entities/teacher-assignment.entity.ts',
  'enrollments/entities/application.entity.ts',
  'enrollments/entities/enrollment.entity.ts',
  'assignments/entities/assignment.entity.ts',
  'assignments/entities/submission.entity.ts',
  'marks/entities/mark.entity.ts',
  'attendance/entities/attendance.entity.ts',
  'fees/entities/fee.entity.ts',
  'timetable/entities/timetable.entity.ts'
];

for (const entityPath of targetEntities) {
  const fullPath = path.join(srcDir, entityPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Add ManyToOne to typeorm imports if not present
    if (!content.includes('ManyToOne')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'typeorm';/m, (match, p1) => {
        return `import { ${p1.trim()}, ManyToOne } from 'typeorm';`;
      });
      changed = true;
    }

    // Add Campus import
    if (!content.includes('Campus')) {
      const depth = entityPath.split('/').length - 1; // 2
      const back = '../'.repeat(depth);
      content = `import { Campus } from '${back}campuses/entities/campus.entity';\n` + content;
      changed = true;
    }

    // Add campusId and campus relation
    if (!content.includes('campusId')) {
      content = content.replace(/}\s*$/m, `
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
  } else {
    console.log(`NOT FOUND: ${fullPath}`);
  }
}
