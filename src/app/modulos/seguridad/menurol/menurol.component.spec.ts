import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenurolComponent } from './menurol.component';

describe('MenurolComponent', () => {
  let component: MenurolComponent;
  let fixture: ComponentFixture<MenurolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenurolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenurolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
