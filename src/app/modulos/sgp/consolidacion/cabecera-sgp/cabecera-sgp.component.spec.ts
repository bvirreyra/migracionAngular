import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceraSgpComponent } from './cabecera-sgp.component';

describe('CabeceraSgpComponent', () => {
  let component: CabeceraSgpComponent;
  let fixture: ComponentFixture<CabeceraSgpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabeceraSgpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabeceraSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
