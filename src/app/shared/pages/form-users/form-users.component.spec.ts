import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormUsersComponent } from './form-users.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValidatorsService } from '../../services/validators.service';
import { SimpleChange } from '@angular/core';

describe('FormUsersComponent', () => {
  let component: FormUsersComponent;
  let fixture: ComponentFixture<FormUsersComponent>;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormUsersComponent ],
      imports: [
        ReactiveFormsModule,
        ConfirmPopupModule,
        MessageModule,
        ButtonModule,
        InputTextModule,
        NoopAnimationsModule
      ],
      providers: [
        FormBuilder,
        ValidatorsService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUsersComponent);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    messageService = fixture.debugElement.injector.get(MessageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load userEdit details into form during ngOnChanges', () => {
    fixture.detectChanges();
    const mockUser = {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      charge: 'Manager',
      phone: '1234567890'
    };

    component.userEdit = mockUser;
    component.ngOnChanges({
      userEdit: new SimpleChange(null, mockUser, true)
    });

    expect(component.userForm.get('name')?.value).toBe('John Doe');
    expect(component.userForm.get('email')?.value).toBe('john@example.com');
    expect(component.userForm.get('charge')?.value).toBe('Manager');
    expect(component.userForm.get('phone')?.value).toBe('1234567890');
  });

  it('should clear form in ngOnChanges when isSaved is true', () => {
    fixture.detectChanges();
    component.userForm.patchValue({ name: 'John' });
    component.isSaved = true;

    component.ngOnChanges({
      isSaved: new SimpleChange(false, true, false)
    });

    expect(component.userForm.get('name')?.value).toBeNull();
  });

  it('should validate form fields based on ValidatorsService patterns', () => {
    fixture.detectChanges();
    const emailCtrl = component.userForm.get('email');
    const phoneCtrl = component.userForm.get('phone');
    const chargeCtrl = component.userForm.get('charge');

    emailCtrl?.setValue('invalid-email');
    phoneCtrl?.setValue('123');
    chargeCtrl?.setValue('ab');

    expect(emailCtrl?.valid).toBeFalse();
    expect(phoneCtrl?.valid).toBeFalse();
    expect(chargeCtrl?.valid).toBeFalse();

    expect(component.getErrorMessage('email')).toBe('Debe ingresar un email valido');
    expect(component.getErrorMessage('phone')).toBe('Debe ingresar un numero de telefono valido a 10 digitos');
    expect(component.getErrorMessage('charge')).toBe('minimo 3 caracteres');

    emailCtrl?.setValue('valid@example.com');
    phoneCtrl?.setValue('2461892520');
    chargeCtrl?.setValue('Manager');

    expect(emailCtrl?.valid).toBeTrue();
    expect(phoneCtrl?.valid).toBeTrue();
    expect(chargeCtrl?.valid).toBeTrue();
  });

  it('should emit onSave on validateSubmit when form is valid', () => {
    fixture.detectChanges();
    spyOn(component.onSave, 'emit');

    component.userForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      charge: 'Manager',
      phone: '2461892520'
    });

    component.validateSubmit();
    expect(component.onSave.emit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      charge: 'Manager',
      phone: '2461892520'
    } as any);
  });

  it('should mark all fields as touched on validateSubmit when form is invalid', () => {
    fixture.detectChanges();
    spyOn(component.onSave, 'emit');

    component.validateSubmit();
    expect(component.onSave.emit).not.toHaveBeenCalled();
    expect(component.userForm.touched).toBeTrue();
  });

  it('should emit onUpdate on updateUser when form is valid', () => {
    fixture.detectChanges();
    spyOn(component.onUpdate, 'emit');
    component.userEdit = { id: 'u-1', name: '', email: '', charge: '', phone: '' };

    component.userForm.patchValue({
      name: 'John Doe Updated',
      email: 'john.upd@example.com',
      charge: 'Director',
      phone: '2461892520'
    });

    component.updateUser();
    expect(component.onUpdate.emit).toHaveBeenCalledWith({
      id: 'u-1',
      name: 'John Doe Updated',
      email: 'john.upd@example.com',
      charge: 'Director',
      phone: '2461892520'
    } as any);
  });

  it('should call confirmationService and emit onDelete accept payload on accept', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      options.accept();
      return confirmationService;
    });
    spyOn(component.onDelete, 'emit');
    component.userEdit = { id: 'u-99', name: 'John Doe', email: '', charge: '', phone: '' };

    component.confirm({ target: {} } as any);

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(component.onDelete.emit).toHaveBeenCalledWith({ id: 'u-99' });
  });

  it('should call confirmationService and emit onDelete null payload on reject', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      options.reject();
      return confirmationService;
    });
    spyOn(component.onDelete, 'emit');
    spyOn(messageService, 'add');
    component.userEdit = { id: 'u-99', name: 'John Doe', email: '', charge: '', phone: '' };

    component.confirm({ target: {} } as any);

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Cancelo',
      detail: 'Sera en otra ocasión John Doe...'
    });
    expect(component.onDelete.emit).toHaveBeenCalledWith(null);
  });

  it('should return true on counterRender', () => {
    expect(component.counterRender()).toBeTrue();
  });
});
