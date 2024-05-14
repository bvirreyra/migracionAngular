import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCitesComponent } from './consulta-cites.component';

describe('ConsultaCitesComponent', () => {
  let component: ConsultaCitesComponent;
  let fixture: ComponentFixture<ConsultaCitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaCitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaCitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
