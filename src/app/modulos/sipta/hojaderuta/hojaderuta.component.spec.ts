import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HojaderutaComponent } from './hojaderuta.component';

describe('HojaderutaComponent', () => {
  let component: HojaderutaComponent;
  let fixture: ComponentFixture<HojaderutaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HojaderutaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HojaderutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
