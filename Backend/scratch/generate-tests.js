const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const testDir = path.join(__dirname, '../test');

const modules = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());

modules.forEach(moduleName => {
  const controllerPath = path.join(srcDir, moduleName, `${moduleName}.controller.ts`);
  const servicePath = path.join(srcDir, moduleName, `${moduleName}.service.ts`);
  
  if (fs.existsSync(controllerPath) && fs.existsSync(servicePath)) {
    const testFilePath = path.join(testDir, `${moduleName}.e2e-spec.ts`);
    if (fs.existsSync(testFilePath)) return; // Skip if already exists
    
    const serviceName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1) + 'Service';
    const controllerContent = fs.readFileSync(controllerPath, 'utf8');
    
    // Check if standard methods exist in controller to avoid failing tests
    const hasPost = controllerContent.includes('@Post()');
    const hasGet = controllerContent.includes('@Get()');
    const hasGetId = controllerContent.includes('@Get(\':id\')');
    const hasPatch = controllerContent.includes('@Patch(\':id\')');
    const hasDelete = controllerContent.includes('@Delete(\':id\')');
    
    let testsStr = '';
    
    if (hasPost) {
      testsStr += `
  it('/${moduleName} (POST)', () => {
    return request(app.getHttpServer())
      .post('/${moduleName}')
      .send({})
      .expect(201);
  });
`;
    }
    
    if (hasGet) {
      testsStr += `
  it('/${moduleName} (GET)', () => {
    return request(app.getHttpServer())
      .get('/${moduleName}')
      .expect(200);
  });
`;
    }
    
    if (hasGetId) {
      testsStr += `
  it('/${moduleName}/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/${moduleName}/1')
      .expect(200);
  });
`;
    }
    
    if (hasPatch) {
      testsStr += `
  it('/${moduleName}/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/${moduleName}/1')
      .send({})
      .expect(200);
  });
`;
    }
    
    if (hasDelete) {
      testsStr += `
  it('/${moduleName}/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/${moduleName}/1')
      .expect(200);
  });
`;
    }
    
    // Extract service methods used in controller
    const serviceMethods = [...controllerContent.matchAll(/this\.[a-zA-Z]+Service\.([a-zA-Z]+)\(/g)].map(m => m[1]);
    const uniqueMethods = [...new Set(serviceMethods)];
    
    let mockMethodsStr = '';
    uniqueMethods.forEach(method => {
      mockMethodsStr += `    ${method}: jest.fn().mockResolvedValue({ id: '1' }),\n`;
    });
    
    const content = `import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ${serviceName} } from '../src/${moduleName}/${moduleName}.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Controller (e2e)', () => {
  let app: INestApplication;
  
  const mockService = {
${mockMethodsStr}  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(${serviceName})
    .useValue(mockService)
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: () => true })
    .overrideGuard(MatrixGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
${testsStr}
});
`;
    fs.writeFileSync(testFilePath, content);
    console.log('Generated test for ' + moduleName);
  }
});
