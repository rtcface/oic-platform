import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PltCodigoEticaComponent } from './plt-codigo-etica.component';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ProtectedService } from 'src/app/protected/services/protected.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { OicEnte, OicInterface } from '../../models/oic.interface';

// Mock child components
@Component({ selector: 'app-finder-oic', template: '' })
class MockFinderOicComponent {
  @Input() title = '';
  @Output() onEnter = new EventEmitter<OicEnte>();
  @Output() onSelectedOicChange = new EventEmitter<OicInterface>();
}

describe('PltCodigoEticaComponent', () => {
  let component: PltCodigoEticaComponent;
  let fixture: ComponentFixture<PltCodigoEticaComponent>;
  let mockProtectedService: jasmine.SpyObj<ProtectedService>;
  let messageService: MessageService;

  beforeEach(async () => {
    mockProtectedService = jasmine.createSpyObj('ProtectedService', ['loadCdoEthic']);

    await TestBed.configureTestingModule({
      declarations: [
        PltCodigoEticaComponent,
        MockFinderOicComponent
      ],
      imports: [
        MessagesModule,
        DividerModule,
        ButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProtectedService, useValue: mockProtectedService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PltCodigoEticaComponent);
    component = fixture.componentInstance;
    messageService = fixture.debugElement.injector.get(MessageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display code directly on showCodigo if it matches specific ID', () => {
    fixture.detectChanges();
    const mockEvent: OicEnte = {
      ente: {
        id: '624c8e3daddddcbcb26e8135',
        nombre_ente: 'Ente Específico',
        siglas_ente: 'EE',
        data: []
      }
    };

    component.showCodigo(mockEvent);

    expect(component.display).toBeTrue();
    expect(component.name_ente).toBe('Ente Específico');
  });

  it('should hide display and show error on showCodigo if ID does not match', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');
    const mockEvent: OicEnte = {
      ente: {
        id: 'other-id',
        nombre_ente: 'Ente Común',
        siglas_ente: 'EC',
        data: []
      }
    };

    component.showCodigo(mockEvent);

    expect(component.display).toBeFalse();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Información',
      detail: 'No hay datos del ente solicitado...'
    });
  });

  it('should call loadCdoEthic and set details on showCodigo2 success', () => {
    fixture.detectChanges();
    const mockCdoResponse = {
      data: {
        cdo: {
          url: 'https://example.com/cdo-file.pdf'
        }
      }
    };
    mockProtectedService.loadCdoEthic.and.returnValue(of(mockCdoResponse as any));

    const mockEvent: OicInterface = {
      id: 'ente-999',
      nombre_ente: 'Ente 999',
      siglas_ente: 'E999',
      data: []
    };

    component.showCodigo2(mockEvent);

    expect(mockProtectedService.loadCdoEthic).toHaveBeenCalledWith({ ente_publico: 'ente-999' });
    expect(component.display).toBeTrue();
    expect(component.name_ente).toBe('Ente 999');
    expect(component.url).toBe('https://example.com/cdo-file.pdf');
  });

  it('should call showError and hide display on loadCdoByEnte error', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');
    mockProtectedService.loadCdoEthic.and.returnValue(throwError(() => new Error('GraphQL error')));

    component.loadCdoByEnte({ ente_publico: 'ente-err' }, 'Ente Error');

    expect(component.display).toBeFalse();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Información',
      detail: 'No hay datos del ente solicitado...'
    });
  });
});
