import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejagestionproyectosComponent } from './bandejagestionproyectos.component';

describe('BandejagestionproyectosComponent', () => {
  let component: BandejagestionproyectosComponent;
  let fixture: ComponentFixture<BandejagestionproyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejagestionproyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejagestionproyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
