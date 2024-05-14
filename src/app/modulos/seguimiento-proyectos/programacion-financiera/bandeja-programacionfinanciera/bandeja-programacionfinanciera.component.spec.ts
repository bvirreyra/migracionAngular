import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaProgramacionfinancieraComponent } from './bandeja-programacionfinanciera.component';

describe('BandejaProgramacionfinancieraComponent', () => {
  let component: BandejaProgramacionfinancieraComponent;
  let fixture: ComponentFixture<BandejaProgramacionfinancieraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaProgramacionfinancieraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaProgramacionfinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
