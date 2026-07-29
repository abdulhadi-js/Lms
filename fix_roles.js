const fs = require('fs');
const path = require('path');
const glob = require('glob');

const srcDir = path.join(__dirname, 'Backend', 'src');
const files = glob.sync(`${srcDir}/**/*.controller.ts`);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('RolesGuard')) {
    content = content.replace(/RolesGuard/g, 'PermissionsGuard');
    content = content.replace(/..\/..\/common\/guards\/roles.guard/g, '../../common/guards/permissions.guard');
    content = content.replace(/..\/common\/guards\/roles.guard/g, '../common/guards/permissions.guard');
    changed = true;
  }

  if (content.includes('@Roles(')) {
    content = content.replace(/import \{ Roles \} from '..\/..\/common\/decorators\/roles.decorator';/g, "import { RequirePermissions } from '../../common/decorators/permissions.decorator';");
    content = content.replace(/import \{ Roles \} from '..\/common\/decorators\/roles.decorator';/g, "import { RequirePermissions } from '../common/decorators/permissions.decorator';");
    content = content.replace(/import \{ Role \} from '..\/..\/common\/enums\/roles.enum';\n/g, "");
    content = content.replace(/import \{ Role \} from '..\/common\/enums\/roles.enum';\n/g, "");
    
    // Replace @Roles(Role.ADMIN, ...) with @RequirePermissions('MANAGE_ALL')
    content = content.replace(/@Roles\([^)]+\)/g, "@RequirePermissions('MANAGE_ALL')");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
