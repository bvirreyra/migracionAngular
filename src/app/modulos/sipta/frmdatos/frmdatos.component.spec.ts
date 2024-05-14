import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { frmdatosComponent } from './frmdatos.component';

describe('frmdatosComponent', () => {
  let component: frmdatosComponent;
  let fixture: ComponentFixture<frmdatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ frmdatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(frmdatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
