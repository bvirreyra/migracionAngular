/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rptej2Component } from './rptej2.component';

describe('Rptej2Component', () => {
  let component: Rptej2Component;
  let fixture: ComponentFixture<Rptej2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rptej2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rptej2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
