import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OicHomeComponent } from './oic-home.component';
import { FieldsetModule } from 'primeng/fieldset';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('OicHomeComponent', () => {
  let component: OicHomeComponent;
  let fixture: ComponentFixture<OicHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OicHomeComponent ],
      imports: [
        FieldsetModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OicHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render general info', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Infomación general');
    expect(compiled.textContent).toContain('Órganos Internos de Control');
  });
});
