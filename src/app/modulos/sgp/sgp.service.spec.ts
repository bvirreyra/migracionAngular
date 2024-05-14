import { TestBed } from '@angular/core/testing';

import { SgpService } from './sgp.service';

describe('SgpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SgpService = TestBed.get(SgpService);
    expect(service).toBeTruthy();
  });
});
