import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulosItemsComponent } from './modulos-items.component';

describe('ModulosItemsComponent', () => {
  let component: ModulosItemsComponent;
  let fixture: ComponentFixture<ModulosItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulosItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulosItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
