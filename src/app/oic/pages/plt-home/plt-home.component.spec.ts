import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PltHomeComponent } from './plt-home.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({ selector: 'app-sppiner', template: '' })
class MockSpinnerComponent {}

describe('PltHomeComponent', () => {
  let component: PltHomeComponent;
  let fixture: ComponentFixture<PltHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PltHomeComponent,
        MockSpinnerComponent
      ],
      imports: [
        FieldsetModule,
        ButtonModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PltHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render fieldset content', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ética pública');
    expect(compiled.querySelector('button')).toBeTruthy();
  });
});
