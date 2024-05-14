import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaFinancieroComponent } from './bandeja-financiero.component';

describe('BandejaFinancieroComponent', () => {
  let component: BandejaFinancieroComponent;
  let fixture: ComponentFixture<BandejaFinancieroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaFinancieroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
