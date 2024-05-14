import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificacionPresupuestariaComponent } from './certificacion-presupuestaria.component';

describe('CertificacionPresupuestariaComponent', () => {
  let component: CertificacionPresupuestariaComponent;
  let fixture: ComponentFixture<CertificacionPresupuestariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificacionPresupuestariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificacionPresupuestariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
