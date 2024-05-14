import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuModulosComponent } from './submenu-modulos.component';

describe('SubmenuModulosComponent', () => {
  let component: SubmenuModulosComponent;
  let fixture: ComponentFixture<SubmenuModulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmenuModulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmenuModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
