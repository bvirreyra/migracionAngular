import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmGestionComponent } from './adm-gestion.component';

describe('AdmGestionComponent', () => {
  let component: AdmGestionComponent;
  let fixture: ComponentFixture<AdmGestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmGestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
