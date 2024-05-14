import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSeguimientoComponent } from './monitoreo-seguimiento.component';

describe('MonitoreoSeguimientoComponent', () => {
  let component: MonitoreoSeguimientoComponent;
  let fixture: ComponentFixture<MonitoreoSeguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSeguimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
