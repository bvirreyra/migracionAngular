import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltraCamposComponent } from './filtra-campos.component';

describe('FiltraCamposComponent', () => {
  let component: FiltraCamposComponent;
  let fixture: ComponentFixture<FiltraCamposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltraCamposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltraCamposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
