import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasProyectoComponent } from './empresas-proyecto.component';

describe('EmpresasProyectoComponent', () => {
  let component: EmpresasProyectoComponent;
  let fixture: ComponentFixture<EmpresasProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresasProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
