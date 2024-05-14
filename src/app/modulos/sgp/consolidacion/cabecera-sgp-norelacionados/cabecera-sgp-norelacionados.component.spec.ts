import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraSgpNorelacionadosComponent } from './cabecera-sgp-norelacionados.component';

describe('CabeceraSgpNorelacionadosComponent', () => {
  let component: CabeceraSgpNorelacionadosComponent;
  let fixture: ComponentFixture<CabeceraSgpNorelacionadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabeceraSgpNorelacionadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabeceraSgpNorelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
