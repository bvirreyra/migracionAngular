import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionpresupuestoComponent } from './asignacionpresupuesto.component';

describe('AsignacionpresupuestoComponent', () => {
  let component: AsignacionpresupuestoComponent;
  let fixture: ComponentFixture<AsignacionpresupuestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionpresupuestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionpresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
