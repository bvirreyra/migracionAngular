import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructurafinanciamientoComponent } from './estructurafinanciamiento.component';

describe('EstructurafinanciamientoComponent', () => {
  let component: EstructurafinanciamientoComponent;
  let fixture: ComponentFixture<EstructurafinanciamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstructurafinanciamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstructurafinanciamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
