import { TestBed, inject } from '@angular/core/testing';

import { FormusuarioService } from './formusuario.service';

describe('FormusuarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormusuarioService]
    });
  });

  it('should be created', inject([FormusuarioService], (service: FormusuarioService) => {
    expect(service).toBeTruthy();
  }));
});
