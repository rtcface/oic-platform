import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAddCdoComponent } from './form-add-cdo.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ValidatorsService } from '../../services/validators.service';
import { SimpleChange } from '@angular/core';

describe('FormAddCdoComponent', () => {
  let component: FormAddCdoComponent;
  let fixture: ComponentFixture<FormAddCdoComponent>;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddCdoComponent ],
      imports: [
        ReactiveFormsModule,
        ToastModule,
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
    fixture = TestBed.createComponent(FormAddCdoComponent);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
    messageService = fixture.debugElement.injector.get(MessageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should enable/disable form based on existeCode input in ngOnChanges', () => {
    component.existeCode = true;
    component.ngOnChanges({
      existeCode: new SimpleChange(false, true, false)
    });
    expect(component.cdoEthicForm.disabled).toBeTrue();

    component.existeCode = false;
    component.ngOnChanges({
      existeCode: new SimpleChange(true, false, false)
    });
    expect(component.cdoEthicForm.enabled).toBeTrue();
  });

  it('should load cdoEdit details into form during ngOnChanges', () => {
    const mockCdo = {
      id: 'cdo-1',
      description: 'Test CDO Description',
      url: 'https://example.com/cdo'
    };
    component.cdoEdit = mockCdo;
    component.ngOnChanges({
      cdoEdit: new SimpleChange(null, mockCdo, true)
    });

    expect(component.cdoEthicForm.get('description')?.value).toBe('Test CDO Description');
    expect(component.cdoEthicForm.get('url')?.value).toBe('https://example.com/cdo');
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    const descriptionCtrl = component.cdoEthicForm.get('description');
    const urlCtrl = component.cdoEthicForm.get('url');

    descriptionCtrl?.setValue('');
    urlCtrl?.setValue('');

    expect(descriptionCtrl?.valid).toBeFalse();
    expect(urlCtrl?.valid).toBeFalse();
    expect(component.getErrorMessage('description')).toBe('Debe ingresar un valor válido');

    descriptionCtrl?.setValue('Valid description');
    urlCtrl?.setValue('https://url.com');
    expect(descriptionCtrl?.valid).toBeTrue();
    expect(urlCtrl?.valid).toBeTrue();
  });

  it('should emit onSave on validateSubmit when form is valid', () => {
    fixture.detectChanges();
    spyOn(component.onSave, 'emit');

    component.cdoEthicForm.patchValue({
      description: 'New Ethics Code',
      url: 'https://ethics.org/code'
    });

    component.validateSubmit();
    expect(component.onSave.emit).toHaveBeenCalledWith({
      description: 'New Ethics Code',
      url: 'https://ethics.org/code',
      ente_publico: ''
    });
  });

  it('should mark all fields as touched on validateSubmit when form is invalid', () => {
    fixture.detectChanges();
    spyOn(component.onSave, 'emit');

    component.validateSubmit();
    expect(component.onSave.emit).not.toHaveBeenCalled();
    expect(component.cdoEthicForm.get('description')?.touched).toBeTrue();
    expect(component.cdoEthicForm.get('url')?.touched).toBeTrue();
  });

  it('should emit onUpdate on updateCdo when form is valid', () => {
    fixture.detectChanges();
    spyOn(component.onUpdate, 'emit');
    component.cdoEdit = { id: '123', description: '', url: '' };

    component.cdoEthicForm.patchValue({
      description: 'Updated Title',
      url: 'https://updated.url'
    });

    component.updateCdo();
    expect(component.onUpdate.emit).toHaveBeenCalledWith({
      id: '123',
      description: 'Updated Title',
      url: 'https://updated.url',
      ente_publico: ''
    } as any);
  });

  it('should call confirmationService and emit onDelete when accept is triggered', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      options.accept();
      return confirmationService;
    });
    spyOn(component.onDelete, 'emit');
    component.cdoEdit = { id: 'cdo-99', description: 'Ethics Code 99', url: '' };

    component.confirm({ target: {} } as any);

    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(component.onDelete.emit).toHaveBeenCalledWith({ id: 'cdo-99' });
  });

  it('should call messageService on reject/cancel of deletion', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      options.reject();
      return confirmationService;
    });
    spyOn(messageService, 'add');
    component.cdoEdit = { id: 'cdo-99', description: 'Ethics Code 99', url: '' };

    component.confirm({ target: {} } as any);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Cancelo',
      detail: 'Sera en otra ocasión Ethics Code 99...'
    });
  });
});
