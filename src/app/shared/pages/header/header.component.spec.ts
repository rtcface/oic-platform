import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.changeDetectorRef.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should bind title_page Input', () => {
    component.title_page = 'Test Portal Title';
    fixture.componentRef.changeDetectorRef.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    // Let's check if the title is rendered.
    expect(compiled.textContent).toContain('Test Portal Title');
  });
});
