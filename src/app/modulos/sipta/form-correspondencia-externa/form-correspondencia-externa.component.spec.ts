import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCorrespondenciaExternaComponent } from './form-correspondencia-externa.component';

describe('FormCorrespondenciaExternaComponent', () => {
  let component: FormCorrespondenciaExternaComponent;
  let fixture: ComponentFixture<FormCorrespondenciaExternaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCorrespondenciaExternaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCorrespondenciaExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
