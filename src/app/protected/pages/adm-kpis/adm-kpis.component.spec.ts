import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AdmKpisComponent } from './adm-kpis.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProtectedService } from '../../services/protected.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmKpisComponent', () => {
  let component: AdmKpisComponent;
  let fixture: ComponentFixture<AdmKpisComponent>;
  let authServiceSpy: any;
  let messageService: MessageService;
  let confirmationService: ConfirmationService;
  let protectedServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      idEnteAuth: 'ente-123'
    };

    protectedServiceSpy = {
      getKpis: jasmine.createSpy('getKpis').and.returnValue(of({
        data: {
          chart: [
            { id: 'kpi-1', kpi: 'Procedimientos iniciados', total_casos: 5 },
            { id: 'kpi-2', kpi: 'Procedimientos concluidos', total_casos: 2 }
          ]
        }
      })),
      saveKpi: jasmine.createSpy('saveKpi').and.returnValue(of({ data: { id: 'new-kpi' } })),
      updateKpi: jasmine.createSpy('updateKpi').and.returnValue(of({ data: { updateKpi: { id: 'kpi-1' } } })),
      deleteKpi: jasmine.createSpy('deleteKpi').and.returnValue(of({ data: { deleteKpi: { id: 'kpi-2' } } }))
    };

    await TestBed.configureTestingModule({
      declarations: [ AdmKpisComponent ],
      imports: [ ReactiveFormsModule, PrimeNgModule, NoopAnimationsModule ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProtectedService, useValue: protectedServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(AdmKpisComponent, {
      set: {
        providers: [
          MessageService,
          ConfirmationService
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmKpisComponent);
    component = fixture.componentInstance;

    messageService = fixture.debugElement.injector.get(MessageService);
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);

    spyOn(messageService, 'add');
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      if (options.accept) {
        options.accept();
      }
      return confirmationService;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load KPIs on init', () => {
    expect(protectedServiceSpy.getKpis).toHaveBeenCalledWith({ ente_publico: 'ente-123' });
    expect(component.data.labels).toEqual(['Procedimientos iniciados (5)', 'Procedimientos concluidos (2)']);
    expect(component.data.datasets[0].data).toEqual([5, 2]);
    expect(component.optionKpi.length).toBe(3);
  });

  it('should return error validation states', () => {
    const field = component.saveForm.get('total');
    field?.setValue('');
    field?.markAsTouched();
    expect(component.validateField('total')).toBeTrue();
    expect(component.getErrorMessage('total')).toBe('Debe ingresar un valor válido');
  });

  it('should mark all fields as touched if form is invalid on save', () => {
    component.saveForm.setValue({ typeCase: '', total: '' });
    component.saveKpi();
    expect(component.saveForm.touched).toBeTrue();
    expect(protectedServiceSpy.saveKpi).not.toHaveBeenCalled();
  });

  it('should call saveKpi when form is valid and reload', () => {
    component.saveForm.setValue({
      typeCase: { name: 'Procedimientos concluidos', value: 2 },
      total: 10
    });
    
    component.saveKpi();
    
    expect(protectedServiceSpy.saveKpi).toHaveBeenCalledWith({
      ente_publico: 'ente-123',
      description: 'Procedimientos concluidos',
      kpi: 'Procedimientos concluidos',
      total_casos: 10
    });
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should handle saveKpi error gracefully', () => {
    protectedServiceSpy.saveKpi.and.returnValue(throwError(() => new Error('API Error')));
    component.saveForm.setValue({
      typeCase: { name: 'Procedimientos concluidos', value: 2 },
      total: 10
    });
    
    component.saveKpi();
    expect(protectedServiceSpy.saveKpi).toHaveBeenCalled();
  });

  it('should open edit dialog with loaded KPI data', () => {
    const mockKpi = { id: 'kpi-1', kpi: 'Procedimientos iniciados', total_casos: 5 };
    component.openEditDialog(mockKpi);
    expect(component.selectedKpiId).toBe('kpi-1');
    expect(component.displayEditDialog).toBeTrue();
    expect(component.editForm.value).toEqual({
      typeCase: { icon: 'pi pi-chart-bar', name: 'Procedimientos iniciados', value: 1 },
      total: 5
    });
  });

  it('should save edited KPI when editForm is valid', () => {
    component.selectedKpiId = 'kpi-1';
    component.editForm.setValue({
      typeCase: { icon: 'pi pi-chart-bar', name: 'Procedimientos iniciados', value: 1 },
      total: 15
    });
    component.saveEdit();
    expect(protectedServiceSpy.updateKpi).toHaveBeenCalledWith('kpi-1', jasmine.objectContaining({
      id: 'kpi-1',
      kpi: 'Procedimientos iniciados',
      total_casos: 15
    }));
    expect(component.displayEditDialog).toBeFalse();
    expect(messageService.add).toHaveBeenCalled();
  });

  it('should not save edited KPI when editForm is invalid', () => {
    component.editForm.setValue({
      typeCase: '',
      total: ''
    });
    component.saveEdit();
    expect(component.editForm.touched).toBeTrue();
    expect(protectedServiceSpy.updateKpi).not.toHaveBeenCalled();
  });

  it('should confirm and delete KPI', () => {
    const mockKpi = { id: 'kpi-2', kpi: 'Procedimientos concluidos', total_casos: 2 };
    const mockEvent = { target: {} } as any;
    component.confirmDelete(mockEvent, mockKpi);
    expect(confirmationService.confirm).toHaveBeenCalled();
    expect(protectedServiceSpy.deleteKpi).toHaveBeenCalledWith('kpi-2');
    expect(messageService.add).toHaveBeenCalled();
  });
});
