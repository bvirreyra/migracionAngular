import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RptEjtablaComponent } from './rpt-ejtabla.component';

describe('RptEjtablaComponent', () => {
  let component: RptEjtablaComponent;
  let fixture: ComponentFixture<RptEjtablaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptEjtablaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptEjtablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
