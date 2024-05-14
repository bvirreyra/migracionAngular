import { TestBed, inject } from '@angular/core/testing';

import { SeguimientoService } from './seguimiento.service';

describe('SeguimientoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SeguimientoService]
    });
  });

  it('should be created', inject([SeguimientoService], (service: SeguimientoService) => {
    expect(service).toBeTruthy();
  }));
});
