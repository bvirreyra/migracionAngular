import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioSeguimientoComponent } from './inicio-seguimiento.component';

describe('InicioSeguimientoComponent', () => {
  let component: InicioSeguimientoComponent;
  let fixture: ComponentFixture<InicioSeguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioSeguimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
