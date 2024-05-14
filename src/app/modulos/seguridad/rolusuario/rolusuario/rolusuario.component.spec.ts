import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolUsuarioComponent } from './rolusuario.component';

describe('RolUsuarioComponent', () => {
  let component: RolUsuarioComponent;
  let fixture: ComponentFixture<RolUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
