import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolucionConvenioComponent } from './resolucion-convenio.component';

describe('ResolucionConvenioComponent', () => {
  let component: ResolucionConvenioComponent;
  let fixture: ComponentFixture<ResolucionConvenioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolucionConvenioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolucionConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
