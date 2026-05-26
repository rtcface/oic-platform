import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
  let messageServiceSpy: any;
  let protectedServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      idEnteAuth: 'ente-123'
    };

    messageServiceSpy = {
      add: jasmine.createSpy('add'),
      messageObserver: of(),
      clearObserver: of()
    };

    protectedServiceSpy = {
      getKpis: jasmine.createSpy('getKpis').and.returnValue(of({
        data: {
          chart: [
            { kpi: 'Iniciados', total_casos: 5 },
            { kpi: 'Concluidos', total_casos: 2 }
          ]
        }
      })),
      saveKpi: jasmine.createSpy('saveKpi').and.returnValue(of({ data: { id: 'new-kpi' } }))
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
          { provide: MessageService, useValue: messageServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load KPIs on init', () => {
    expect(protectedServiceSpy.getKpis).toHaveBeenCalledWith({ ente_publico: 'ente-123' });
    expect(component.data.labels).toEqual(['Iniciados', 'Concluidos']);
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
    expect(messageServiceSpy.add).toHaveBeenCalled();
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
});
