import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenciaEnviadaComponent } from './correspondencia-enviada.component';

describe('CorrespondenciaEnviadaComponent', () => {
  let component: CorrespondenciaEnviadaComponent;
  let fixture: ComponentFixture<CorrespondenciaEnviadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorrespondenciaEnviadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrespondenciaEnviadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
