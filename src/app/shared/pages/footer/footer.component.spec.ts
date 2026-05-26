import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.changeDetectorRef.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the current year and footer text', () => {
    component.text_footer = 'Test Footer Brand';
    fixture.componentRef.changeDetectorRef.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const currentYear = new Date().getFullYear().toString();
    expect(compiled.textContent).toContain(currentYear);
    expect(compiled.textContent).toContain('Test Footer Brand');
  });
});
