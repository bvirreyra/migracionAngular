import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenFinancieroComponent } from './resumen-financiero.component';

describe('ResumenFinancieroComponent', () => {
  let component: ResumenFinancieroComponent;
  let fixture: ComponentFixture<ResumenFinancieroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenFinancieroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
