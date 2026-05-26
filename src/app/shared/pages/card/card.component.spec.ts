import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { CardComponent } from './card.component';
import { AuthService } from '../../../auth/services/auth.service';
import { user_card } from '../../models/colaborador.interface';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let routerMock: any;
  let authServiceMock: any;
  const mockUser: user_card = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'assets/avatar.png',
    isLogin: true
  };

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    authServiceMock = {
      isLoggedIn: { login: { token: 'some-token' } },
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [ PrimeNgModule ],
      declarations: [ CardComponent ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.user = mockUser;
  });

  it('should create', () => {
    fixture.componentRef.changeDetectorRef.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the user details when logged in', () => {
    fixture.componentRef.changeDetectorRef.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-title')?.textContent).toContain('John Doe');
    expect(compiled.querySelector('.card-text')?.textContent).toContain('john@example.com');
    // Button should be 'Cerrar Sesión'
    const button = compiled.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Cerrar Sesión');
  });

  it('should display Iniciar Sesión button when not logged in', () => {
    component.user = { ...mockUser, isLogin: false };
    fixture.componentRef.changeDetectorRef.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Iniciar Sesión');
  });

  it('should return authService.isLoggedIn via isLoggedIn getter', () => {
    expect(component.isLoggedIn).toEqual(authServiceMock.isLoggedIn);
  });

  it('should perform logout and navigate to /oic', () => {
    spyOn(component.onClear, 'emit');
    spyOn(localStorage, 'removeItem');

    component.logout();

    expect(component.onClear.emit).toHaveBeenCalledWith(true);
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/oic']);
  });

  it('should navigate to /login on login()', () => {
    component.login();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
