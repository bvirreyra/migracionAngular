import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmtablaComponent } from './admtabla.component';

describe('AdmtablaComponent', () => {
  let component: AdmtablaComponent;
  let fixture: ComponentFixture<AdmtablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmtablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmtablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
