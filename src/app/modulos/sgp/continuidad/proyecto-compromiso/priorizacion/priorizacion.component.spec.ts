import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorizacionComponent } from './priorizacion.component';

describe('PriorizacionComponent', () => {
  let component: PriorizacionComponent;
  let fixture: ComponentFixture<PriorizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriorizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
