import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApliacionPlazoComponent } from './apliacion-plazo.component';

describe('ApliacionPlazoComponent', () => {
  let component: ApliacionPlazoComponent;
  let fixture: ComponentFixture<ApliacionPlazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApliacionPlazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApliacionPlazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
