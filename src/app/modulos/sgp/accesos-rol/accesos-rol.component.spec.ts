import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccesosRolComponent } from './accesos-rol.component';

describe('AccesosRolComponent', () => {
  let component: AccesosRolComponent;
  let fixture: ComponentFixture<AccesosRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesosRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccesosRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
