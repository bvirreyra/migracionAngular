import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedordocumentosComponent } from './contenedordocumentos.component';

describe('ContenedordocumentosComponent', () => {
  let component: ContenedordocumentosComponent;
  let fixture: ComponentFixture<ContenedordocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenedordocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenedordocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
