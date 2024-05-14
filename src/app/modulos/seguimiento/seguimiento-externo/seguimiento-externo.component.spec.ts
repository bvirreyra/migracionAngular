import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoExternoComponent } from './seguimiento-externo.component';

describe('SeguimientoExternoComponent', () => {
  let component: SeguimientoExternoComponent;
  let fixture: ComponentFixture<SeguimientoExternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoExternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
