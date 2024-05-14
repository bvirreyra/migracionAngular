import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaSinDepurarComponent } from './asistenciasindepurar.component';

describe('AsistenciaComponent', () => {
  let component: AsistenciaSinDepurarComponent;
  let fixture: ComponentFixture<AsistenciaSinDepurarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaSinDepurarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaSinDepurarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
