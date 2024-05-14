import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCorrespondenciaInternaComponent } from './form-correspondencia-interna.component';

describe('FormCorrespondenciaInternaComponent', () => {
  let component: FormCorrespondenciaInternaComponent;
  let fixture: ComponentFixture<FormCorrespondenciaInternaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCorrespondenciaInternaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCorrespondenciaInternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
