import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicaciongeoComponent } from './ubicaciongeo.component';

describe('UbicaciongeoComponent', () => {
  let component: UbicaciongeoComponent;
  let fixture: ComponentFixture<UbicaciongeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicaciongeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicaciongeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
