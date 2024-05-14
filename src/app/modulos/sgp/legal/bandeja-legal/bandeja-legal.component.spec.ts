import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaLegalComponent } from './bandeja-legal.component';

describe('BandejaLegalComponent', () => {
  let component: BandejaLegalComponent;
  let fixture: ComponentFixture<BandejaLegalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaLegalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
