import { TestBed } from '@angular/core/testing';

import { MonitoreoCompromisoV2Service } from './monitoreo-compromiso-v2.service';

describe('MonitoreoCompromisoV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonitoreoCompromisoV2Service = TestBed.get(MonitoreoCompromisoV2Service);
    expect(service).toBeTruthy();
  });
});
