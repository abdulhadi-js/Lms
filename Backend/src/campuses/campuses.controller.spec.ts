import { Test, TestingModule } from '@nestjs/testing';
import { CampusesController } from './campuses.controller';

describe('CampusesController', () => {
  let controller: CampusesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampusesController],
    }).compile();

    controller = module.get<CampusesController>(CampusesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
