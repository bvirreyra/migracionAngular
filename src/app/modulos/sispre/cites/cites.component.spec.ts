import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitesComponent } from './cites.component';

describe('CitesComponent', () => {
  let component: CitesComponent;
  let fixture: ComponentFixture<CitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
