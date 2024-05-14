import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleArchivoComponent } from './detalle-archivo.component';

describe('DetalleArchivoComponent', () => {
  let component: DetalleArchivoComponent;
  let fixture: ComponentFixture<DetalleArchivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleArchivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleArchivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
