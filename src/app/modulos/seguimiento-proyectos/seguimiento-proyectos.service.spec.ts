import { TestBed } from '@angular/core/testing';

import { SeguimientoProyectosService } from './seguimiento-proyectos.service';

describe('SeguimientoProyectosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeguimientoProyectosService = TestBed.get(SeguimientoProyectosService);
    expect(service).toBeTruthy();
  });
});
