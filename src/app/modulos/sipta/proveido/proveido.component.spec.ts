import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveidoComponent } from './proveido.component';

describe('ProveidoComponent', () => {
  let component: ProveidoComponent;
  let fixture: ComponentFixture<ProveidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
