const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Backend', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 1. Add @Index() to entities
walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.entity.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Add Index import if not exists
    if (!content.includes('Index,') && !content.includes('Index ')) {
      content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]typeorm['"];/, 'import { Index, $1 } from \'typeorm\';');
    }

    // Add @Index() above @ManyToOne
    content = content.replace(/(@ManyToOne\([^)]+\)\n\s+)/g, '@Index()\n  $1');

    // Add @Index() above heavily queried primitive columns
    content = content.replace(/(@Column\(\{ unique: true \}\)\s+email:)/g, '@Index()\n  $1');
    content = content.replace(/(@Column\(\{.*enum: Role.*\}\)\s+role:)/g, '@Index()\n  $1');
    content = content.replace(/(@Column\(\{.*enum: UserStatus.*\}\)\s+status:)/g, '@Index()\n  $1');
    content = content.replace(/(@Column\(\)\s+courseId:)/g, '@Index()\n  $1');
    content = content.replace(/(@Column\(\)\s+studentId:)/g, '@Index()\n  $1');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added indexes to ${path.basename(filePath)}`);
    }
  }
});

// 2. Add pagination to Controllers and Services
// We'll target users and courses as requested in the QA report.

function updateServicePagination(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // users.service.ts: async findAll(role?: Role)
    if (filePath.includes('users.service.ts')) {
      content = content.replace(/async findAll\(role\?: Role\): Promise<SafeUser\[\]> \{/, 'async findAll(role?: Role, limit: number = 50, offset: number = 0): Promise<SafeUser[]> {');
      content = content.replace(/const users = await qb\.getMany\(\);/, 'const users = await qb.take(limit).skip(offset).getMany();');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated users.service.ts');
    }
    // courses.service.ts: async findAll(role?: Role, userId?: string)
    if (filePath.includes('courses.service.ts')) {
      content = content.replace(/async findAll\(role\?: string, userId\?: string\): Promise<Course\[\]> \{/, 'async findAll(role?: string, userId?: string, limit: number = 50, offset: number = 0): Promise<Course[]> {');
      content = content.replace(/return await qb\.getMany\(\);/, 'return await qb.take(limit).skip(offset).getMany();');
      content = content.replace(/const courses = await qb\.getMany\(\);/, 'const courses = await qb.take(limit).skip(offset).getMany();');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated courses.service.ts');
    }
  }
}

function updateControllerPagination(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // users.controller.ts: findAll(@Query('role') role?: Role)
    if (filePath.includes('users.controller.ts')) {
      content = content.replace(/findAll\(@Query\('role'\) role\?: Role\) \{/, "findAll(@Query('role') role?: Role, @Query('limit') limit?: number, @Query('offset') offset?: number) {");
      content = content.replace(/return this.usersService.findAll\(role\);/, 'return this.usersService.findAll(role, limit, offset);');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated users.controller.ts');
    }
    // courses.controller.ts: findAll(@Query('role') role?: string, @CurrentUser() user?: any)
    if (filePath.includes('courses.controller.ts')) {
      content = content.replace(/findAll\(@Query\('role'\) role\?: string, @CurrentUser\(\) user\?: unknown\) \{/, "findAll(@Query('role') role?: string, @Query('limit') limit?: number, @Query('offset') offset?: number, @CurrentUser() user?: any) {");
      content = content.replace(/return this.coursesService.findAll\(role, user\?.id\);/, 'return this.coursesService.findAll(role, user?.id, limit, offset);');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated courses.controller.ts');
    }
  }
}

updateServicePagination(path.join(srcDir, 'users', 'users.service.ts'));
updateControllerPagination(path.join(srcDir, 'users', 'users.controller.ts'));
updateServicePagination(path.join(srcDir, 'courses', 'courses.service.ts'));
updateControllerPagination(path.join(srcDir, 'courses', 'courses.controller.ts'));

console.log('Pagination and indexes added.');
