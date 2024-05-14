import { TestBed } from '@angular/core/testing';

import { GeofuncionariosService } from './geofuncionarios.service';

describe('GeofuncionariosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeofuncionariosService = TestBed.get(GeofuncionariosService);
    expect(service).toBeTruthy();
  });
});
