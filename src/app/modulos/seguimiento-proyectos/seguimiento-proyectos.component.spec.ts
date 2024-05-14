import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoProyectosComponent } from './seguimiento-proyectos.component';

describe('SeguimientoProyectosComponent', () => {
  let component: SeguimientoProyectosComponent;
  let fixture: ComponentFixture<SeguimientoProyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
