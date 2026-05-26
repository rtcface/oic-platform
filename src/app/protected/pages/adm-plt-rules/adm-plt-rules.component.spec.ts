import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AdmPltRulesComponent } from './adm-plt-rules.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProtectedService } from '../../services/protected.service';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmPltRulesComponent', () => {
  let component: AdmPltRulesComponent;
  let fixture: ComponentFixture<AdmPltRulesComponent>;
  let authServiceSpy: any;
  let protectedServiceSpy: any;
  let messageServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      idEnteAuth: 'ente-123'
    };

    protectedServiceSpy = {
      getIntegrationRules: jasmine.createSpy('getIntegrationRules').and.returnValue(of({
        data: {
          rules: [
            { id: 'rule-1', p1: 'value1', p2: 'value2', ente_publico: 'ente-123' }
          ]
        }
      })),
      initRules: jasmine.createSpy('initRules').and.returnValue(of({ data: {} })),
      updateRules: jasmine.createSpy('updateRules').and.returnValue(of({ data: { status: 'success' } }))
    };

    messageServiceSpy = {
      add: jasmine.createSpy('add'),
      messageObserver: of(),
      clearObserver: of()
    };

    await TestBed.configureTestingModule({
      declarations: [ AdmPltRulesComponent ],
      imports: [ PrimeNgModule, NoopAnimationsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ProtectedService, useValue: protectedServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(AdmPltRulesComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPltRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load integrity rules on init', () => {
    expect(component).toBeTruthy();
    expect(protectedServiceSpy.getIntegrationRules).toHaveBeenCalledWith({ ente_publico: 'ente-123' });
    expect(component.data.id).toBe('rule-1');
  });

  it('should initialize rules if getIntegrationRules returns empty or null rules array', () => {
    protectedServiceSpy.getIntegrationRules.and.returnValue(of({
      data: {
        rules: []
      }
    }));
    
    // Reset spy calls and re-initialize
    protectedServiceSpy.getIntegrationRules.calls.reset();
    component.ngOnInit();
    
    expect(protectedServiceSpy.getIntegrationRules).toHaveBeenCalled();
    expect(protectedServiceSpy.initRules).toHaveBeenCalledWith({ ente_publico: 'ente-123' });
  });

  it('should handle getIntegrationRules error gracefully', () => {
    protectedServiceSpy.getIntegrationRules.and.returnValue(throwError(() => new Error('Error loading rules')));
    component.loadRules();
    // Verify it doesn't crash
    expect(protectedServiceSpy.getIntegrationRules).toHaveBeenCalled();
  });

  it('should handle initRules error gracefully', () => {
    protectedServiceSpy.getIntegrationRules.and.returnValue(of({ data: { rules: [] } }));
    protectedServiceSpy.initRules.and.returnValue(throwError(() => new Error('Init error')));
    component.loadRules();
    expect(protectedServiceSpy.initRules).toHaveBeenCalled();
  });

  it('should save/update rules successfully', () => {
    const updatedRules = { id: 'rule-1', p1: 'newValue' } as any;
    component.saveSubmit(updatedRules);
    
    expect(protectedServiceSpy.updateRules).toHaveBeenCalledWith(updatedRules);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle save/update rule errors', () => {
    protectedServiceSpy.updateRules.and.returnValue(throwError(() => new Error('Update error')));
    const updatedRules = { id: 'rule-1', p1: 'newValue' } as any;
    component.saveSubmit(updatedRules);
    
    expect(protectedServiceSpy.updateRules).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle save/update rules returning null response', () => {
    protectedServiceSpy.updateRules.and.returnValue(of({ data: null }));
    const updatedRules = { id: 'rule-1', p1: 'newValue' } as any;
    component.saveSubmit(updatedRules);
    
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });
});
