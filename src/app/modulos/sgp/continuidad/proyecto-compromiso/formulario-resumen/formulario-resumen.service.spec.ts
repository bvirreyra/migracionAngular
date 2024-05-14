import { TestBed } from '@angular/core/testing';

import { FormularioResumenService } from './formulario-resumen.service';

describe('FormularioResumenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormularioResumenService = TestBed.get(FormularioResumenService);
    expect(service).toBeTruthy();
  });
});
