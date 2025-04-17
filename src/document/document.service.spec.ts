import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';

describe('DocumentsService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentService],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('Deve ser definido.', () => {
    expect(service).toBeDefined();
  });
});
