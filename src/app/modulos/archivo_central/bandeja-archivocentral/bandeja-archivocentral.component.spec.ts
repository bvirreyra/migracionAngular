import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaArchivocentralComponent } from './bandeja-archivocentral.component';

describe('BandejaArchivocentralComponent', () => {
  let component: BandejaArchivocentralComponent;
  let fixture: ComponentFixture<BandejaArchivocentralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BandejaArchivocentralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaArchivocentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
