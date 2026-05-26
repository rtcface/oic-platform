import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PltPreguntasComponent } from './plt-preguntas.component';
import { FieldsetModule } from 'primeng/fieldset';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PltPreguntasComponent', () => {
  let component: PltPreguntasComponent;
  let fixture: ComponentFixture<PltPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PltPreguntasComponent ],
      imports: [
        FieldsetModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PltPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render frequent questions', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Preguntas frecuentes');
    expect(compiled.textContent).toContain('¿Qué entiendes por ética pública?');
    expect(compiled.textContent).toContain('¿Cómo se aplica la ética pública?');
  });
});
