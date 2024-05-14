import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSolicitudesComponent } from './monitoreo-solicitudes.component';

describe('MonitoreoSolicitudesComponent', () => {
  let component: MonitoreoSolicitudesComponent;
  let fixture: ComponentFixture<MonitoreoSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
