import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarseguimientoComponent } from './ingresarseguimiento.component';

describe('IngresarseguimientoComponent', () => {
  let component: IngresarseguimientoComponent;
  let fixture: ComponentFixture<IngresarseguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresarseguimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarseguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
