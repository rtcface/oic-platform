import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register() on click', () => {
    spyOn(component, 'register');
    const form = fixture.nativeElement.querySelector('form');
    form.addEventListener('submit', (e: Event) => e.preventDefault());
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.register).toHaveBeenCalled();
  });
});
