import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasPeriodopresidencialComponent } from './empresas-periodopresidencial.component';

describe('EmpresasPeriodopresidencialComponent', () => {
  let component: EmpresasPeriodopresidencialComponent;
  let fixture: ComponentFixture<EmpresasPeriodopresidencialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresasPeriodopresidencialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpresasPeriodopresidencialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
