import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoCompromisoV2Component } from './monitoreo-compromiso-v2.component';

describe('MonitoreoCompromisoV2Component', () => {
  let component: MonitoreoCompromisoV2Component;
  let fixture: ComponentFixture<MonitoreoCompromisoV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoCompromisoV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoCompromisoV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
