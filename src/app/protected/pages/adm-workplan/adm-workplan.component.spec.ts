import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AdmWorkplanComponent } from './adm-workplan.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GetOicService } from 'src/app/oic/services/get-oic.service';
import { ProtectedService } from '../../services/protected.service';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmWorkplanComponent', () => {
  let component: AdmWorkplanComponent;
  let fixture: ComponentFixture<AdmWorkplanComponent>;
  let authServiceSpy: any;
  let getOicServiceSpy: any;
  let protectedServiceSpy: any;
  let messageServiceSpy: any;
  let confirmationServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      idEnteAuth: 'ente-123'
    };

    getOicServiceSpy = {
      getWorkPlanFromGraph: jasmine.createSpy('getWorkPlanFromGraph').and.returnValue(of({
        data: {
          data: {
            label: 'Plan de Trabajo',
            data: 'root-data',
            children: [
              {
                id: 'root-child-1',
                label: 'Año 2026',
                data: 'year-data',
                children: [
                  {
                    id: 'child-leaf-1',
                    label: 'Ficha Técnica',
                    data: 'leaf-data',
                    icon: 'pi pi-file',
                    url: 'http://example.com/file.pdf'
                  }
                ]
              }
            ]
          }
        }
      }))
    };

    protectedServiceSpy = {
      savePlwd: jasmine.createSpy('savePlwd').and.returnValue(of({ data: {} })),
      updatePlwd: jasmine.createSpy('updatePlwd').and.returnValue(of({ data: {} })),
      deletePlwd: jasmine.createSpy('deletePlwd').and.returnValue(of({ data: {} }))
    };

    messageServiceSpy = {
      add: jasmine.createSpy('add'),
      messageObserver: of(),
      clearObserver: of()
    };

    confirmationServiceSpy = new ConfirmationService();
    spyOn(confirmationServiceSpy, 'confirm').and.callFake((config: any) => {
      config.accept();
    });

    await TestBed.configureTestingModule({
      declarations: [ AdmWorkplanComponent ],
      imports: [ ReactiveFormsModule, PrimeNgModule, NoopAnimationsModule ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: GetOicService, useValue: getOicServiceSpy },
        { provide: ProtectedService, useValue: protectedServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(AdmWorkplanComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceSpy },
          { provide: ConfirmationService, useValue: confirmationServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmWorkplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load work plan tree on init', () => {
    expect(component).toBeTruthy();
    expect(getOicServiceSpy.getWorkPlanFromGraph).toHaveBeenCalled();
    expect(component.files.length).toBe(1);
    expect(component.files[0].label).toBe('Plan de Trabajo');
    expect(component.files[0].children?.length).toBe(1);
    expect(component.files[0].children?.[0].children?.[0].label).toBe('Ficha Técnica');
  });

  it('should handle getWorkPlanFromGraph returning null/empty work plan', () => {
    getOicServiceSpy.getWorkPlanFromGraph.and.returnValue(of({
      data: {
        data: {
          label: null
        }
      }
    }));
    component.loadWorkPlan();
    expect(component.files.length).toBe(0);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should filter tree labels', () => {
    component.files = [
      { label: 'Enero' },
      { label: 'Febrero' }
    ];
    component.filterTree({ query: 'En' });
    expect(component.files.length).toBe(1);
    expect(component.files[0].label).toBe('Enero');
  });

  it('should open edit dialog when a child node is selected', () => {
    const event = {
      node: {
        id: 'child-leaf-1',
        isChild: true,
        label: 'Ficha Técnica',
        data: 'leaf-data',
        url: 'http://example.com/file.pdf'
      }
    };
    component.nodeSelect(event);
    expect(component.display).toBeTrue();
    expect(component.update_wpd.id).toBe('child-leaf-1');
  });

  it('should not open edit dialog if selected node is not a child', () => {
    const event = {
      node: {
        id: 'root-child-1',
        isChild: false
      }
    };
    component.nodeSelect(event);
    expect(component.display).toBeFalse();
  });

  it('should open save dialog when a root node is selected', () => {
    const event = {
      node: {
        id: 'root-child-1',
        isRoot: true
      }
    };
    component.nodeSelectSave(event);
    expect(component.displayForm).toBeTrue();
    expect(component.id_Anio).toBe('root-child-1');
  });

  it('should not open save dialog if selected node is not root', () => {
    const event = {
      node: {
        id: 'child-leaf-1',
        isRoot: false
      }
    };
    component.nodeSelectSave(event);
    expect(component.displayForm).toBeFalse();
  });

  it('should open external URL on redirect', () => {
    spyOn(window, 'open');
    component.redirect('http://google.com');
    expect(window.open).toHaveBeenCalledWith('http://google.com', '_blank');
  });

  it('should mark all fields as touched if saveForm is invalid on saveFile', () => {
    component.saveForm.setValue({ id: '', label: '', data: '', url: '' });
    component.saveFile();
    expect(component.saveForm.touched).toBeTrue();
    expect(protectedServiceSpy.savePlwd).not.toHaveBeenCalled();
  });

  it('should save file successfully when form is valid', () => {
    component.saveForm.setValue({
      id: '',
      label: 'New Child',
      data: 'data-new',
      url: 'http://new.pdf'
    });
    component.id_Anio = 'root-123';
    
    component.saveFile();
    
    expect(protectedServiceSpy.savePlwd).toHaveBeenCalledWith({
      IdParent: 'root-123',
      label: 'New Child',
      data: 'data-new',
      url: 'http://new.pdf'
    });
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should mark all fields as touched if updateForm is invalid on updateFile', () => {
    component.updateForm.setValue({ id: '', label: '', data: '', url: '' });
    component.updateFile();
    expect(component.updateForm.touched).toBeTrue();
    expect(protectedServiceSpy.updatePlwd).not.toHaveBeenCalled();
  });

  it('should update file successfully when form is valid', () => {
    component.updateForm.setValue({
      id: '',
      label: 'Updated Child',
      data: 'data-updated',
      url: 'http://updated.pdf'
    });
    component.update_wpd = { id: 'child-123' } as any;
    
    component.updateFile();
    
    expect(protectedServiceSpy.updatePlwd).toHaveBeenCalledWith({
      id: 'child-123',
      label: 'Updated Child',
      data: 'data-updated',
      url: 'http://updated.pdf'
    });
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should delete plan work successfully', () => {
    component.deletePlanWork({ id: 'child-123' });
    expect(protectedServiceSpy.deletePlwd).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should update plan work from updatePlanWork method', () => {
    const pw = { id: 'child-123', label: 'A', data: 'B', url: 'C' };
    component.updatePlanWork(pw);
    expect(protectedServiceSpy.updatePlwd).toHaveBeenCalledWith(pw);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should show confirmation dialog and delete on confirm accept', () => {
    component.update_wpd = { id: 'child-123', label: 'Leaf' } as any;
    const mockEvent = {} as Event;
    component.confirm(mockEvent);
    
    expect(confirmationServiceSpy.confirm).toHaveBeenCalled();
    expect(protectedServiceSpy.deletePlwd).toHaveBeenCalledWith({ id: 'child-123' });
  });

  it('should trigger noDelete when confirmation is rejected', () => {
    confirmationServiceSpy.confirm.and.callFake((config: any) => {
      config.reject();
    });
    component.update_wpd = { id: 'child-123', label: 'Leaf' } as any;
    const mockEvent = {} as Event;
    component.confirm(mockEvent);
    
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should return error message for form validation', () => {
    const label = component.saveForm.get('label');
    label?.setErrors({ required: true });
    expect(component.getErrorMessage('label')).toBe('Debe ingresar un valor válido');
    
    const labelUp = component.updateForm.get('label');
    labelUp?.setErrors({ required: true });
    expect(component.getErrorMessageUpdate('label')).toBe('Debe ingresar un valor válido');
  });

  it('should return validation states', () => {
    const label = component.saveForm.get('label');
    label?.setValue('');
    label?.markAsTouched();
    expect(component.validateField('label')).toBeTrue();

    const labelUp = component.updateForm.get('label');
    labelUp?.setValue('');
    labelUp?.markAsTouched();
    expect(component.validateFieldUpdate('label')).toBeTrue();
  });
});
