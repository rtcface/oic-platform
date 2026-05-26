import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of, throwError, asyncScheduler } from 'rxjs';
import { AdmPltCodigoEticaComponent } from './adm-plt-codigo-etica.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProtectedService } from '../../services/protected.service';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmPltCodigoEticaComponent', () => {
  let component: AdmPltCodigoEticaComponent;
  let fixture: ComponentFixture<AdmPltCodigoEticaComponent>;
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
      loadCdoEthic: jasmine.createSpy('loadCdoEthic').and.returnValue(of({
        data: {
          cdo: {
            id: 'cdo-123',
            description: 'Código de Ética Test',
            url: 'http://example.com/cdo.pdf',
            ente_publico: 'ente-123'
          }
        }
      })),
      registerCdoEthica: jasmine.createSpy('registerCdoEthica').and.returnValue(of({
        data: {
          cdo: { id: 'cdo-123' }
        }
      })),
      delete_cdo: jasmine.createSpy('delete_cdo').and.returnValue(of({
        data: {
          cdo: { id: 'cdo-123' }
        }
      })),
      update_cdo: jasmine.createSpy('update_cdo').and.returnValue(of({
        data: {
          cdo: { id: 'cdo-123' }
        }
      }))
    };

    await TestBed.configureTestingModule({
      declarations: [ AdmPltCodigoEticaComponent ],
      imports: [ PrimeNgModule, NoopAnimationsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProtectedService, useValue: protectedServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(AdmPltCodigoEticaComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPltCodigoEticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load ethics code on init', () => {
    expect(component).toBeTruthy();
    expect(protectedServiceSpy.loadCdoEthic).toHaveBeenCalled();
    expect(component.cdoEthic.description).toBe('Código de Ética Test');
    expect(component.existsCdo).toBeTrue();
    expect(component.btnEditCdo).toBeFalse();
  });

  it('should handle loadCdoEthic error gracefully', () => {
    protectedServiceSpy.loadCdoEthic.and.returnValue(throwError(() => new Error('Load Error')));
    component.loadCdoEthic('ente-123');
    expect(component.existsCdo).toBeFalse();
  });

  it('should trigger ngOnChanges and reload code', () => {
    protectedServiceSpy.loadCdoEthic.calls.reset();
    component.ngOnChanges({});
    expect(protectedServiceSpy.loadCdoEthic).toHaveBeenCalled();
  });

  it('should show dialog', () => {
    expect(component.display).toBeFalse();
    component.showDialog();
    expect(component.display).toBeTrue();
  });

  it('should save code and show success message', () => {
    const mockSave = { description: 'New description', url: 'http://example.com/new.pdf' };
    component.saveCdo(mockSave as any);
    
    expect(protectedServiceSpy.registerCdoEthica).toHaveBeenCalledWith({
      description: 'New description',
      url: 'http://example.com/new.pdf',
      ente_publico: 'ente-123'
    });
    expect(component.isSaved).toBeTrue();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle save error', () => {
    protectedServiceSpy.registerCdoEthica.and.returnValue(throwError(() => new Error('Save Error')));
    const mockSave = { description: 'New description', url: 'http://example.com/new.pdf' };
    component.saveCdo(mockSave as any);
    
    expect(component.isSaved).toBeFalse();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should open update dialog', () => {
    const mockUpdate = { id: 'cdo-123', description: 'Updated', url: 'http://new.pdf' };
    component.updateCdoData(mockUpdate);
    expect(component.cdoEthic).toEqual(mockUpdate);
    expect(component.display).toBeTrue();
  });

  it('should delete code and update UI status', () => {
    protectedServiceSpy.loadCdoEthic.and.returnValue(of({
      data: {
        cdo: { description: '', url: '', id: '' }
      }
    }));
    const mockDelete = { id: 'cdo-123' };
    component.delete(mockDelete);
    
    expect(protectedServiceSpy.delete_cdo).toHaveBeenCalledWith(mockDelete);
    expect(messageServiceSpy.add).toHaveBeenCalled();
    expect(component.btnEditCdo).toBeTrue();
  });

  it('should handle delete error', () => {
    protectedServiceSpy.delete_cdo.and.returnValue(throwError(() => new Error('Delete Error')));
    const mockDelete = { id: 'cdo-123' };
    component.delete(mockDelete);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should update code and close dialog', () => {
    const mockUpdate = { id: 'cdo-123', description: 'Updated', url: 'http://new.pdf' };
    component.update(mockUpdate);
    
    expect(protectedServiceSpy.update_cdo).toHaveBeenCalledWith(mockUpdate);
    expect(messageServiceSpy.add).toHaveBeenCalled();
    expect(component.display).toBeFalse();
  });

  it('should handle update error', () => {
    protectedServiceSpy.update_cdo.and.returnValue(throwError(() => new Error('Update Error')));
    const mockUpdate = { id: 'cdo-123', description: 'Updated', url: 'http://new.pdf' };
    component.update(mockUpdate);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });
});
