import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmActividadesComponent } from './adm-actividades.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { AuthService } from '../../../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AdmActividadesComponent', () => {
  let component: AdmActividadesComponent;
  let fixture: ComponentFixture<AdmActividadesComponent>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let messageSpy: jasmine.SpyObj<MessageService>;
  let mockAuthService: any;

  beforeEach(async () => {
    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['save_Actividad', 'get_Actividades', 'add_Evidencia']);
    sharedServiceSpy.get_Actividades.and.returnValue(of({ data: { getActividades: [] } }));
    
    messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    mockAuthService = {
      get idEnteAuth() {
        return 'ente-123';
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ AdmActividadesComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .overrideComponent(AdmActividadesComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should not call save_Actividad when submitting invalid form', () => {
    component.onSubmit();
    expect(sharedServiceSpy.save_Actividad).not.toHaveBeenCalled();
    expect(component.form.controls['titulo'].touched).toBeTruthy();
    expect(component.form.controls['descripcion'].touched).toBeTruthy();
  });

  it('should be valid when filled correctly and submit successfully', () => {
    component.form.controls['titulo'].setValue('Test Titulo');
    component.form.controls['descripcion'].setValue('Test Descripcion');
    expect(component.form.valid).toBeTruthy();

    sharedServiceSpy.save_Actividad.and.returnValue(of({ data: { saveActividad: { success: true, id: 'act-123' } }, loading: false } as any));

    component.onSubmit();

    expect(sharedServiceSpy.save_Actividad).toHaveBeenCalledWith({
      titulo: 'Test Titulo',
      descripcion: 'Test Descripcion'
    });
    expect(messageSpy.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
  });

  it('should open evidence dialog and reset state', () => {
    component.openEvidenceDialog('act-123');
    expect(component.selectedActividadId).toBe('act-123');
    expect(component.selectedFileName).toBe('');
    expect(component.selectedFileBase64).toBe('');
    expect(component.showEvidenceDialog).toBeTrue();
  });

  it('should call add_Evidencia on submitEvidence with valid data', () => {
    component.selectedActividadId = 'act-123';
    component.selectedFileBase64 = 'data:image/png;base64,mock';
    component.evidenceForm.controls['titulo_evidencia'].setValue('Evidencia Test');
    
    sharedServiceSpy.add_Evidencia.and.returnValue(of({ data: { addEvidencia: { success: true } } } as any));

    component.submitEvidence();

    expect(sharedServiceSpy.add_Evidencia).toHaveBeenCalledWith('act-123', {
      titulo: 'Evidencia Test',
      archivo: 'data:image/png;base64,mock'
    });
    expect(messageSpy.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    expect(component.showEvidenceDialog).toBeFalse();
  });
});
