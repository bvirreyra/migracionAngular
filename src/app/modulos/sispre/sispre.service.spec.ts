import { TestBed } from '@angular/core/testing';

import { SispreService } from './sispre.service';

describe('SispreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SispreService = TestBed.get(SispreService);
    expect(service).toBeTruthy();
  });
});
