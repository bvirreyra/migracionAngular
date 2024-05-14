import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoCompromisoComponent } from './monitoreo-compromiso.component';

describe('MonitoreoCompromisoComponent', () => {
  let component: MonitoreoCompromisoComponent;
  let fixture: ComponentFixture<MonitoreoCompromisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoCompromisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoCompromisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
