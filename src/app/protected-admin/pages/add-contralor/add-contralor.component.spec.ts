import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddContralorComponent } from './add-contralor.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddContralorComponent', () => {
  let component: AddContralorComponent;
  let fixture: ComponentFixture<AddContralorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContralorComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContralorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
