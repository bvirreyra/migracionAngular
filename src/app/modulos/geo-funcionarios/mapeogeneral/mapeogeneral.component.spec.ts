import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapeogeneralComponent } from './mapeogeneral.component';

describe('MapeogeneralComponent', () => {
  let component: MapeogeneralComponent;
  let fixture: ComponentFixture<MapeogeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapeogeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapeogeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
