import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservarProyectoComponent } from './observar-proyecto.component';

describe('ObservarProyectoComponent', () => {
  let component: ObservarProyectoComponent;
  let fixture: ComponentFixture<ObservarProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservarProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservarProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
