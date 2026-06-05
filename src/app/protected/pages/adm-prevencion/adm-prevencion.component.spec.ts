import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmPrevencionComponent } from './adm-prevencion.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmPrevencionComponent', () => {
  let component: AdmPrevencionComponent;
  let fixture: ComponentFixture<AdmPrevencionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdmPrevencionComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPrevencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
