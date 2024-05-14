import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaitemsComponent } from './bandejaitems.component';

describe('BandejaitemsComponent', () => {
  let component: BandejaitemsComponent;
  let fixture: ComponentFixture<BandejaitemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaitemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
