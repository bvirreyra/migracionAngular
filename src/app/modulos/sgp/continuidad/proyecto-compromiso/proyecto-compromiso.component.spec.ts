import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoCompromisoComponent } from './proyecto-compromiso.component';

describe('ProyectoCompromisoComponent', () => {
  let component: ProyectoCompromisoComponent;
  let fixture: ComponentFixture<ProyectoCompromisoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyectoCompromisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectoCompromisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
