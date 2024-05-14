import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MMenuComponent } from './mmenu.component';

describe('MMenuComponent', () => {
  let component: MMenuComponent;
  let fixture: ComponentFixture<MMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
