import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MModuloComponent } from './mmodulo.component';

describe('RolUsuarioComponent', () => {
  let component: MModuloComponent;
  let fixture: ComponentFixture<MModuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MModuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
