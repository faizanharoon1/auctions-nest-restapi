import { Test, TestingModule } from '@nestjs/testing';
import { LogmoduleService } from './logmodule.service';

describe('LogmoduleService', () => {
  let service: LogmoduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogmoduleService],
    }).compile();

    service = module.get<LogmoduleService>(LogmoduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
