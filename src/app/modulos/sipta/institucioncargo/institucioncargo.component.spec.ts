import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitucioncargoComponent } from './institucioncargo.component';

describe('InstitucioncargoComponent', () => {
  let component: InstitucioncargoComponent;
  let fixture: ComponentFixture<InstitucioncargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitucioncargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitucioncargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
