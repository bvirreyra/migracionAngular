import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientofisicofinancieroComponent } from './seguimientofisicofinanciero.component';

describe('SeguimientofisicofinancieroComponent', () => {
  let component: SeguimientofisicofinancieroComponent;
  let fixture: ComponentFixture<SeguimientofisicofinancieroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientofisicofinancieroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientofisicofinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
