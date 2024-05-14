import { TestBed } from '@angular/core/testing';

import { RrhhService } from './rrhh.service';

describe('RrhhService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RrhhService = TestBed.get(RrhhService);
    expect(service).toBeTruthy();
  });
});
