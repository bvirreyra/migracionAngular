import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { unidadorganizacionalComponent } from './unidadorganizacional.component';

describe('InstitucioncargoComponent', () => {
  let component: unidadorganizacionalComponent;
  let fixture: ComponentFixture<unidadorganizacionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ unidadorganizacionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(unidadorganizacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
