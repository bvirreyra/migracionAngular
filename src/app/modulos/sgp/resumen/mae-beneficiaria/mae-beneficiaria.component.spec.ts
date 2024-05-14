import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaeBeneficiariaComponent } from './mae-beneficiaria.component';

describe('MaeBeneficiariaComponent', () => {
  let component: MaeBeneficiariaComponent;
  let fixture: ComponentFixture<MaeBeneficiariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaeBeneficiariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaeBeneficiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
