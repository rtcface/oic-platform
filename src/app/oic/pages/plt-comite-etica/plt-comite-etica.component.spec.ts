import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PltComiteEticaComponent } from './plt-comite-etica.component';
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

describe('PltComiteEticaComponent', () => {
  let component: PltComiteEticaComponent;
  let fixture: ComponentFixture<PltComiteEticaComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let messageService: MessageService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['get_tree_comite']);

    await TestBed.configureTestingModule({
      declarations: [
        PltComiteEticaComponent,
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
    fixture = TestBed.createComponent(PltComiteEticaComponent);
    component = fixture.componentInstance;
    messageService = fixture.debugElement.injector.get(MessageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load tree using loadTreefromFinder and trigger get_tree_comite query', () => {
    fixture.detectChanges();
    const mockTreeResponse = {
      data: {
        TreeColaboradoresData: {
          label: 'President',
          data: { name: 'Arturo' }
        }
      }
    };
    mockAuthService.get_tree_comite.and.returnValue(of(mockTreeResponse as any));

    const mockEvent: OicEnte = {
      ente: { id: 'ente-10', nombre_ente: 'Ente 10', siglas_ente: 'E10', data: [] }
    };

    component.loadTreefromFinder(mockEvent);

    expect(component.ente).toBe('ente-10');
    expect(mockAuthService.get_tree_comite).toHaveBeenCalledWith({
      boss: { ente: 'ente-10' }
    });
    expect(component.data).toEqual([mockTreeResponse.data.TreeColaboradoresData]);
  });

  it('should load tree using loadTreeFromFinderSelectedOic and trigger get_tree_comite query', () => {
    fixture.detectChanges();
    const mockTreeResponse = {
      data: {
        TreeColaboradoresData: {
          label: 'President',
          data: { name: 'Arturo' }
        }
      }
    };
    mockAuthService.get_tree_comite.and.returnValue(of(mockTreeResponse as any));

    const mockEvent: OicInterface = {
      id: 'ente-11', nombre_ente: 'Ente 11', siglas_ente: 'E11', data: []
    };

    component.loadTreeFromFinderSelectedOic(mockEvent);

    expect(component.ente).toBe('ente-11');
    expect(mockAuthService.get_tree_comite).toHaveBeenCalledWith({
      boss: { ente: 'ente-11' }
    });
    expect(component.data).toEqual([mockTreeResponse.data.TreeColaboradoresData]);
  });

  it('should call showError and purgeTree when tree data is null', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');
    const mockTreeResponse = {
      data: {
        TreeColaboradoresData: {
          data: null
        }
      }
    };
    mockAuthService.get_tree_comite.and.returnValue(of(mockTreeResponse as any));

    component.loadTree({ boss: { ente: 'ente-empty-comite' } });

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
      id: 'user-2', name: 'Arturo', email: 'arturo@example.com', charge: 'President', phone: '123'
    };

    component.viewUserData(mockUser);

    expect(component.selectedUser).toEqual(mockUser);
    expect(component.display).toBeTrue();
  });
});
