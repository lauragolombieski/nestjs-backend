import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';

describe('DocumentsController', () => {
  let controller: DocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  it('Precisa definir', () => {
    expect(controller).toBeDefined();
  });
});
