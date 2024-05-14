import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionpersonalComponent } from './ubicacionpersonal.component';

describe('UbicacionpersonalComponent', () => {
  let component: UbicacionpersonalComponent;
  let fixture: ComponentFixture<UbicacionpersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicacionpersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionpersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
