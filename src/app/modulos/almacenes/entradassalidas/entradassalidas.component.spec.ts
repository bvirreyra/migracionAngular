import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradassalidasComponent } from './entradassalidas.component';

describe('EntradassalidasComponent', () => {
  let component: EntradassalidasComponent;
  let fixture: ComponentFixture<EntradassalidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradassalidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradassalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
