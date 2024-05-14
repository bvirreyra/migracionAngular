import { TestBed } from '@angular/core/testing';

import { PriorizacionService } from './priorizacion.service';

describe('PriorizacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PriorizacionService = TestBed.get(PriorizacionService);
    expect(service).toBeTruthy();
  });
});
