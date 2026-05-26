import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let routerMock: any;
  let authServiceMock: any;
  let messageServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    authServiceMock = {
      change_password: jasmine.createSpy('change_password').and.returnValue(of({
        data: {
          login: {
            haveError: false,
            user: {
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
      declarations: [ ChangePasswordComponent ],
      providers: [
        FormBuilder,
        ValidatorsService,
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { queryParams: of({ page: 'oic' }) } },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .overrideComponent(ChangePasswordComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceMock }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
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

    it('should require all password fields', () => {
      const form = component.myForm;
      expect(form.controls['oldPassword'].valid).toBeFalse();
      expect(form.controls['newPassword'].valid).toBeFalse();
      expect(form.controls['confirmPassword'].valid).toBeFalse();

      form.controls['oldPassword'].setValue('old123');
      form.controls['newPassword'].setValue('new123');
      form.controls['confirmPassword'].setValue('new123');
      expect(form.valid).toBeTrue();
    });

    it('should set error if new password and confirm password do not match', () => {
      const form = component.myForm;
      form.controls['oldPassword'].setValue('old123');
      form.controls['newPassword'].setValue('new123');
      form.controls['confirmPassword'].setValue('different');
      
      fixture.detectChanges();

      expect(form.valid).toBeFalse();
      expect(form.controls['confirmPassword'].hasError('noMatch')).toBeTrue();
    });
  });

  describe('changePassword flow', () => {
    it('should not call authService.change_password if form is invalid', async () => {
      await component.changaPassword();
      expect(authServiceMock.change_password).not.toHaveBeenCalled();
    });

    it('should call authService.change_password and navigate after 3 seconds on success', fakeAsync(() => {
      component.myForm.controls['oldPassword'].setValue('old123');
      component.myForm.controls['newPassword'].setValue('new123');
      component.myForm.controls['confirmPassword'].setValue('new123');

      component.changaPassword();
      tick();

      expect(authServiceMock.change_password).toHaveBeenCalled();
      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: 'El cambio de contraseña fue exitoso'
      });

      // Navigate should not be called immediately
      expect(routerMock.navigate).not.toHaveBeenCalled();

      // Wait 3000ms
      tick(3000);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should call showError on change_password error response', fakeAsync(() => {
      component.myForm.controls['oldPassword'].setValue('old123');
      component.myForm.controls['newPassword'].setValue('new123');
      component.myForm.controls['confirmPassword'].setValue('new123');

      authServiceMock.change_password.and.returnValue(throwError(() => new Error('GraphQL error')));

      component.changaPassword();
      tick();

      expect(messageServiceMock.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario y/o Contraseña incorrectos'
      });
      expect(routerMock.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('helper methods', () => {
    it('should return correct error messages', () => {
      const confirmPass = component.myForm.controls['confirmPassword'];
      
      confirmPass.setErrors({ required: true });
      expect(component.getErrorMessage('confirmPassword')).toBe('campo requerido');

      confirmPass.setErrors({ noMatch: true });
      expect(component.getErrorMessage('confirmPassword')).toBe('Contraseñas no coinciden');

      confirmPass.setErrors({ minlength: true });
      expect(component.getErrorMessage('confirmPassword')).toBe('minimo 3 caracteres');
    });
  });
});
