import { TestBed } from '@angular/core/testing';

import { MonitoreoCompromisoService } from './monitoreo-compromiso.service';

describe('MonitoreoCompromisoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoCompromisoService = TestBed.get(MonitoreoCompromisoService);
    expect(service).toBeTruthy();
  });
});
