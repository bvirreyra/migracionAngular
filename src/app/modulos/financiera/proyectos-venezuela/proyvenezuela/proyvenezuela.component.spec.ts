import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyvenezuelaComponent } from './proyvenezuela.component';

describe('ProyvenezuelaComponent', () => {
  let component: ProyvenezuelaComponent;
  let fixture: ComponentFixture<ProyvenezuelaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProyvenezuelaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyvenezuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
