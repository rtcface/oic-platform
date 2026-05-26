import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatosGeneralesComponent } from './datos-generales.component';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OicEnte, OicInterface } from '../../models/oic.interface';
import { user_edit } from '../../../shared/models/colaborador.interface';

// Mock child components
@Component({ selector: 'app-finder-oic', template: '' })
class MockFinderOicComponent {
  @Input() title = '';
  @Output() onEnter = new EventEmitter<OicEnte>();
  @Output() onSelectedOicChange = new EventEmitter<OicInterface>();
}

@Component({ selector: 'app-tree', template: '' })
class MockTreeComponent {
  @Input() filterData: any = null;
  @Input() data: any[] = [];
  @Output() onNodeSelected = new EventEmitter<user_edit>();
}

@Component({ selector: 'app-view-users', template: '' })
class MockViewUsersComponent {
  @Input() users: any = {};
}

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let fixture: ComponentFixture<DatosGeneralesComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let messageService: MessageService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['get_tree_colaboradores']);

    await TestBed.configureTestingModule({
      declarations: [
        DatosGeneralesComponent,
        MockFinderOicComponent,
        MockTreeComponent,
        MockViewUsersComponent
      ],
      imports: [
        MessagesModule,
        DividerModule,
        DialogModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    messageService = fixture.debugElement.injector.get(MessageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load tree using loadTreefromFinder and trigger get_tree_colaboradores query', () => {
    fixture.detectChanges();
    const mockTreeResponse = {
      data: {
        getColaboresTreeData: {
          label: 'Director',
          data: { name: 'John Doe' }
        }
      }
    };
    mockAuthService.get_tree_colaboradores.and.returnValue(of(mockTreeResponse as any));

    const mockEvent: OicEnte = {
      ente: { id: 'ente-1', nombre_ente: 'Ente 1', siglas_ente: 'E1', data: [] }
    };

    component.loadTreefromFinder(mockEvent);

    expect(component.ente).toBe('ente-1');
    expect(mockAuthService.get_tree_colaboradores).toHaveBeenCalledWith({
      boss: { ente: 'ente-1' }
    });
    expect(component.data).toEqual([mockTreeResponse.data.getColaboresTreeData]);
  });

  it('should load tree using loadTreeFromFinderSelectedOic and trigger get_tree_colaboradores query', () => {
    fixture.detectChanges();
    const mockTreeResponse = {
      data: {
        getColaboresTreeData: {
          label: 'Director',
          data: { name: 'John Doe' }
        }
      }
    };
    mockAuthService.get_tree_colaboradores.and.returnValue(of(mockTreeResponse as any));

    const mockEvent: OicInterface = {
      id: 'ente-2', nombre_ente: 'Ente 2', siglas_ente: 'E2', data: []
    };

    component.loadTreeFromFinderSelectedOic(mockEvent);

    expect(component.ente).toBe('ente-2');
    expect(mockAuthService.get_tree_colaboradores).toHaveBeenCalledWith({
      boss: { ente: 'ente-2' }
    });
    expect(component.data).toEqual([mockTreeResponse.data.getColaboresTreeData]);
  });

  it('should call showError and purgeTree when tree data is null', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');
    const mockTreeResponse = {
      data: {
        getColaboresTreeData: {
          data: null
        }
      }
    };
    mockAuthService.get_tree_colaboradores.and.returnValue(of(mockTreeResponse as any));

    component.loadTree({ boss: { ente: 'ente-empty' } });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Información',
      detail: 'No hay datos del ente solicitado...'
    });
    expect(component.data).toEqual([]);
  });

  it('should set selectedUser and show popup on viewUserData', () => {
    fixture.detectChanges();
    const mockUser: user_edit = {
      id: 'user-1', name: 'John Doe', email: 'john@example.com', charge: 'Boss', phone: '123'
    };

    component.viewUserData(mockUser);

    expect(component.selectedUser).toEqual(mockUser);
    expect(component.display).toBeTrue();
  });
});
