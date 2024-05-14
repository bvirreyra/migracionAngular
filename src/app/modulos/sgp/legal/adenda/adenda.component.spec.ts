import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdendaComponent } from './adenda.component';

describe('AdendaComponent', () => {
  let component: AdendaComponent;
  let fixture: ComponentFixture<AdendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
