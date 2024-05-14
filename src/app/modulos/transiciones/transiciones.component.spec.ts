import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransicionesComponent } from './transiciones.component';

describe('TransicionesComponent', () => {
  let component: TransicionesComponent;
  let fixture: ComponentFixture<TransicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
