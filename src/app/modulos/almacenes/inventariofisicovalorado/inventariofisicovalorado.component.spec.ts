import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventariofisicovaloradoComponent } from './inventariofisicovalorado.component';

describe('InventariofisicovaloradoComponent', () => {
  let component: InventariofisicovaloradoComponent;
  let fixture: ComponentFixture<InventariofisicovaloradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventariofisicovaloradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventariofisicovaloradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
