import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MMenuRolComponent } from './mmenurol.component';

describe('MMenuComponent', () => {
  let component: MMenuRolComponent;
  let fixture: ComponentFixture<MMenuRolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MMenuRolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MMenuRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
