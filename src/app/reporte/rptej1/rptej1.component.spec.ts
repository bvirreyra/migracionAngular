/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rptej1Component } from './rptej1.component';

describe('Rptej1Component', () => {
  let component: Rptej1Component;
  let fixture: ComponentFixture<Rptej1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rptej1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rptej1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
