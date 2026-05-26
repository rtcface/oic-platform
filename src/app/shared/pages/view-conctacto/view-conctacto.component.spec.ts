import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewConctactoComponent } from './view-conctacto.component';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ViewConctactoComponent', () => {
  let component: ViewConctactoComponent;
  let fixture: ComponentFixture<ViewConctactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConctactoComponent ],
      imports: [
        PanelModule,
        CardModule,
        DividerModule,
        ButtonModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConctactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render contact card', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Lic. Arturo Flores López');
    expect(compiled.textContent).toContain('Jefe de Departamento');
  });
});
