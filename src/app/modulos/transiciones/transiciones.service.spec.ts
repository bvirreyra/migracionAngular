import { TestBed } from '@angular/core/testing';

import { TransicionesService } from './transiciones.service';

describe('TransicionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransicionesService = TestBed.get(TransicionesService);
    expect(service).toBeTruthy();
  });
});
