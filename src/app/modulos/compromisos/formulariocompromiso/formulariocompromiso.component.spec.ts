import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulariocompromisoComponent } from './formulariocompromiso.component';

describe('FormulariocompromisoComponent', () => {
  let component: FormulariocompromisoComponent;
  let fixture: ComponentFixture<FormulariocompromisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulariocompromisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulariocompromisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
