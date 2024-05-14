import { TestBed } from '@angular/core/testing';

import { ProgramacionService } from './programacion.service';

describe('ProgramacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgramacionService = TestBed.get(ProgramacionService);
    expect(service).toBeTruthy();
  });
});
