import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreAdministrativoComponent } from './cierre-administrativo.component';

describe('CierreAdministrativoComponent', () => {
  let component: CierreAdministrativoComponent;
  let fixture: ComponentFixture<CierreAdministrativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CierreAdministrativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CierreAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
