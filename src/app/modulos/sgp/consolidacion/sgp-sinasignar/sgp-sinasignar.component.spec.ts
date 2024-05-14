import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpSinasignarComponent } from './sgp-sinasignar.component';

describe('SgpSinasignarComponent', () => {
  let component: SgpSinasignarComponent;
  let fixture: ComponentFixture<SgpSinasignarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgpSinasignarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgpSinasignarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
