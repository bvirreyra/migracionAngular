import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaTecnicaComponent } from './bandeja-tecnica.component';

describe('BandejaTecnicaComponent', () => {
  let component: BandejaTecnicaComponent;
  let fixture: ComponentFixture<BandejaTecnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaTecnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
