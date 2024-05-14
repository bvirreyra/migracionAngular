import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaItemComponent } from './boleta-item.component';

describe('BoletaItemComponent', () => {
  let component: BoletaItemComponent;
  let fixture: ComponentFixture<BoletaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoletaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
