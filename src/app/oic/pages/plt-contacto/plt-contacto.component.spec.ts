import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PltContactoComponent } from './plt-contacto.component';

@Component({ selector: 'app-statistics', template: '' })
class MockStatisticsComponent {}

describe('PltContactoComponent', () => {
  let component: PltContactoComponent;
  let fixture: ComponentFixture<PltContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PltContactoComponent,
        MockStatisticsComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PltContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
