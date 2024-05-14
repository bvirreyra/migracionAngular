import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasEstructurafinanciamientoComponent } from './das-estructurafinanciamiento.component';

describe('DasEstructurafinanciamientoComponent', () => {
  let component: DasEstructurafinanciamientoComponent;
  let fixture: ComponentFixture<DasEstructurafinanciamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasEstructurafinanciamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasEstructurafinanciamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
