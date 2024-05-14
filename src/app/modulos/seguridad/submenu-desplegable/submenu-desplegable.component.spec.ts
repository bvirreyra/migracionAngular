import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmenuDesplegableComponent } from './submenu-desplegable.component';

describe('SubmenuDesplegableComponent', () => {
  let component: SubmenuDesplegableComponent;
  let fixture: ComponentFixture<SubmenuDesplegableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmenuDesplegableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmenuDesplegableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
