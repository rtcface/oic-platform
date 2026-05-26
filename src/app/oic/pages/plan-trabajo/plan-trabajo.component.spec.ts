import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PlanTrabajoComponent } from './plan-trabajo.component';
import { PanelModule } from 'primeng/panel';
import { TreeModule } from 'primeng/tree';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { MessageService, TreeNode } from 'primeng/api';
import { GetOicService } from '../../services/get-oic.service';
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

describe('PlanTrabajoComponent', () => {
  let component: PlanTrabajoComponent;
  let fixture: ComponentFixture<PlanTrabajoComponent>;
  let mockGetOicService: jasmine.SpyObj<GetOicService>;
  let messageService: MessageService;

  beforeEach(async () => {
    mockGetOicService = jasmine.createSpyObj('GetOicService', ['getWorkPlanFromGraph']);

    await TestBed.configureTestingModule({
      declarations: [
        PlanTrabajoComponent,
        MockFinderOicComponent
      ],
      imports: [
        PanelModule,
        TreeModule,
        MessagesModule,
        DividerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: GetOicService, useValue: mockGetOicService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTrabajoComponent);
    component = fixture.componentInstance;
    messageService = fixture.debugElement.injector.get(MessageService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should filter tree files locally by query', () => {
    fixture.detectChanges();
    component.files = [
      { label: 'Plan 2024' },
      { label: 'Informe 2023' }
    ];

    component.filterTree({ query: 'Plan' });

    expect(component.files.length).toBe(1);
    expect(component.files[0].label).toBe('Plan 2024');
  });

  it('should redirect when nodeSelect with url is called', () => {
    fixture.detectChanges();
    spyOn(component, 'redirect');
    const mockEvent = {
      node: {
        label: 'File 1',
        url: 'https://download.com/file1.pdf'
      }
    };

    component.nodeSelect(mockEvent);

    expect(component.redirect).toHaveBeenCalledWith('https://download.com/file1.pdf');
  });

  it('should open new blank window on redirect', () => {
    fixture.detectChanges();
    spyOn(window, 'open');

    component.redirect('https://test.url');

    expect(window.open).toHaveBeenCalledWith('https://test.url', '_blank');
  });

  it('should load work plan using loadWorkPlan and fetch from graph', () => {
    fixture.detectChanges();
    const mockResponse = {
      data: {
        data: {
          label: 'Plan de Trabajo',
          data: 'root-data',
          children: [
            {
              label: 'Child 1',
              data: 'child-data',
              children: [
                {
                  label: 'Child Child 1',
                  data: 'cc-data',
                  icon: 'pi pi-file',
                  url: 'https://cc.url'
                }
              ]
            }
          ]
        }
      }
    };
    mockGetOicService.getWorkPlanFromGraph.and.returnValue(of(mockResponse as any));

    const mockEvent: OicEnte = {
      ente: { id: 'ente-88', nombre_ente: 'Ente 88', siglas_ente: 'E88', data: [] }
    };

    component.loadWorkPlan(mockEvent);

    expect(mockGetOicService.getWorkPlanFromGraph).toHaveBeenCalledWith({
      ente: { ente_publico: 'ente-88' }
    });
    expect(component.files.length).toBe(1);
    expect(component.files[0].label).toBe('Plan de Trabajo');
    expect(component.files[0].children?.[0].label).toBe('Child 1');
    expect(component.files[0].children?.[0].children?.[0].label).toBe('Child Child 1');
    expect((component.files[0].children?.[0].children?.[0] as any).url).toBe('https://cc.url');
  });

  it('should load work plan using loadWorkPlanFinderSelectedOic and fetch from graph', () => {
    fixture.detectChanges();
    const mockResponse = {
      data: {
        data: {
          label: 'Plan de Trabajo',
          data: 'root-data',
          children: []
        }
      }
    };
    mockGetOicService.getWorkPlanFromGraph.and.returnValue(of(mockResponse as any));

    const mockEvent: OicInterface = {
      id: 'ente-89', nombre_ente: 'Ente 89', siglas_ente: 'E89', data: []
    };

    component.loadWorkPlanFinderSelectedOic(mockEvent);

    expect(mockGetOicService.getWorkPlanFromGraph).toHaveBeenCalledWith({
      ente: { ente_publico: 'ente-89' }
    });
    expect(component.files.length).toBe(1);
  });

  it('should call showError and clear files when graph data is null', () => {
    fixture.detectChanges();
    spyOn(messageService, 'add');
    const mockResponse = {
      data: {
        data: {
          label: null
        }
      }
    };
    mockGetOicService.getWorkPlanFromGraph.and.returnValue(of(mockResponse as any));

    component.loadWpd({ ente: { ente_publico: 'empty' } });

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Información',
      detail: 'No hay datos del ente solicitado...'
    });
    expect(component.files).toEqual([]);
  });
});
