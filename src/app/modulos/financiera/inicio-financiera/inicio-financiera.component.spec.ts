import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioFinancieraComponent } from './inicio-financiera.component';

describe('InicioFinancieraComponent', () => {
  let component: InicioFinancieraComponent;
  let fixture: ComponentFixture<InicioFinancieraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InicioFinancieraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioFinancieraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
