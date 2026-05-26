import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../../shared/services/validators.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;
  let authServiceMock: any;
  let messageServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    authServiceMock = {
      logout: jasmine.createSpy('logout'),
      login: jasmine.createSpy('login').and.returnValue(of({
        data: {
          login: {
            haveError: false,
            Err: null,
            token: 'mock-token',
            user: {
              id: '1',
              name: 'Test',
              email: 'test@test.com',
              role: 'user',
              firstSignIn: true
            }
          }
        }
      }))
    };

    messageServiceMock = {
      add: jasmine.createSpy('add'),
      messageObserver: of(),
      clearObserver: of()
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PrimeNgModule
      ],
      declarations: [ LoginComponent ],
      providers: [
        FormBuilder,
        ValidatorsService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { queryParams: of({ page: 'oic' }) } },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    // Overriding the component provider for MessageService
    .overrideComponent(LoginComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceMock }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.myForm.valid).toBeFalse();
    });

    it('should validate email pattern', () => {
      const email = component.myForm.controls['loginValue'];
      email.setValue('invalid-email');
      expect(email.valid).toBeFalse();
      expect(email.hasError('pattern')).toBeTrue();

      email.setValue('test@test.com');
      expect(email.valid).toBeTrue();
    });

    it('should validate password required', () => {
      const password = component.myForm.controls['passwordValue'];
      expect(password.valid).toBeFalse();
      expect(password.hasError('required')).toBeTrue();

      password.setValue('password123');
      expect(password.valid).toBeTrue();
    });
  });

  describe('login flow', () => {
    it('should call authService.logout on login', async () => {
      component.myForm.controls['loginValue'].setValue('test@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      
      await component.login();

      expect(authServiceMock.logout).toHaveBeenCalled();
    });

    it('should not call authService.login if form is invalid', async () => {
      component.myForm.controls['loginValue'].setValue('');
      component.myForm.controls['passwordValue'].setValue('');
      
      await component.login();

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should navigate to /oic/oic on success for user role in oic portal', async () => {
      component.myForm.controls['loginValue'].setValue('test@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      component.page = 'oic';

      await component.login();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/oic/oic']);
    });

    it('should navigate to /oic/plt/plt on success for user role in plt portal', async () => {
      component.myForm.controls['loginValue'].setValue('test@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      component.page = 'plt';

      // Mock auth response to match complete block conditions
      component.role = 'user';
      component.firstSignIn = true;

      await component.login();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/oic/plt/plt']);
    });

    it('should navigate to /oic/oic/protected-admin on success for admin role in oic portal', async () => {
      component.myForm.controls['loginValue'].setValue('admin@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      component.page = 'oic';

      authServiceMock.login.and.returnValue(of({
        data: {
          login: {
            haveError: false,
            user: {
              role: 'admin',
              firstSignIn: true
            }
          }
        }
      }));

      await component.login();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/oic/oic/protected-admin']);
    });

    it('should navigate to /protected/adm-users on success for contralor role in oic portal', async () => {
      component.myForm.controls['loginValue'].setValue('contralor@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      component.page = 'oic';

      authServiceMock.login.and.returnValue(of({
        data: {
          login: {
            haveError: false,
            user: {
              role: 'contralor',
              firstSignIn: true
            }
          }
        }
      }));

      await component.login();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/protected/adm-users'], { queryParams: { type: 'oic' } });
    });

    it('should navigate to /auth/change-password on success if firstSignIn is false', async () => {
      component.myForm.controls['loginValue'].setValue('test@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      component.page = 'oic';

      authServiceMock.login.and.returnValue(of({
        data: {
          login: {
            haveError: false,
            user: {
              role: 'user',
              firstSignIn: false
            }
          }
        }
      }));

      await component.login();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/change-password']);
    });

    it('should show error using MessageService on login error response', async () => {
      component.myForm.controls['loginValue'].setValue('test@test.com');
      component.myForm.controls['passwordValue'].setValue('password123');
      
      authServiceMock.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      await component.login();

      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario y/o Contraseña incorrectos'
      });
    });
  });

  describe('helper methods', () => {
    it('should return correct error message', () => {
      const login = component.myForm.controls['loginValue'];
      
      login.setErrors({ required: true });
      expect(component.getErrorMessage('loginValue')).toBe('Campo requerido');

      login.setErrors({ minlength: true });
      expect(component.getErrorMessage('loginValue')).toBe('minimo 3 caracteres');

      login.setErrors({ pattern: true });
      expect(component.getErrorMessage('loginValue')).toBe('correo no valido');
    });
  });
});
