import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpAsignadoDobleComponent } from './sgp-asignado-doble.component';

describe('SgpAsignadoDobleComponent', () => {
  let component: SgpAsignadoDobleComponent;
  let fixture: ComponentFixture<SgpAsignadoDobleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgpAsignadoDobleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgpAsignadoDobleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
