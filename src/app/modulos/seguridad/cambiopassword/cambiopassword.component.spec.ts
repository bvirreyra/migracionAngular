import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiopasswordComponent } from './cambiopassword.component';

describe('CambiopasswordComponent', () => {
  let component: CambiopasswordComponent;
  let fixture: ComponentFixture<CambiopasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiopasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiopasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
