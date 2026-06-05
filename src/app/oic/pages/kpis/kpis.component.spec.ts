import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KpisComponent } from './kpis.component';
import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';
import { MessagesModule } from 'primeng/messages';
import { DividerModule } from 'primeng/divider';
import { FilterService } from 'primeng/api';
import { GetOicService } from '../../services/get-oic.service';
import { ProtectedService } from 'src/app/protected/services/protected.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OicEnte, OicInterface } from '../../models/oic.interface';

// Mock child components
@Component({ selector: 'app-finder-oic', template: '' })
class MockFinderOicComponent {
  @Input() title = '';
  @Output() onEnter = new EventEmitter<OicEnte>();
  @Output() onSelectedOicChange = new EventEmitter<OicInterface>();
}

describe('KpisComponent', () => {
  let component: KpisComponent;
  let fixture: ComponentFixture<KpisComponent>;
  let mockGetOicService: jasmine.SpyObj<GetOicService>;
  let mockProtectedService: jasmine.SpyObj<ProtectedService>;
  let mockFilterService: jasmine.SpyObj<FilterService>;

  const mockOicsData: OicInterface[] = [
    { id: '1', nombre_ente: 'Ente 1', siglas_ente: 'E1', data: [] },
    { id: '2', nombre_ente: 'Ente 2', siglas_ente: 'E2', data: [] }
  ];

  beforeEach(async () => {
    mockGetOicService = jasmine.createSpyObj('GetOicService', ['getOic']);
    mockProtectedService = jasmine.createSpyObj('ProtectedService', ['getKpis']);
    mockFilterService = jasmine.createSpyObj('FilterService', ['filter']);

    mockGetOicService.getOic.and.returnValue(of({ data: mockOicsData } as any));

    await TestBed.configureTestingModule({
      declarations: [
        KpisComponent,
        MockFinderOicComponent
      ],
      imports: [
        PanelModule,
        ChartModule,
        MessagesModule,
        DividerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: GetOicService, useValue: mockGetOicService },
        { provide: ProtectedService, useValue: mockProtectedService },
        { provide: FilterService, useValue: mockFilterService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpisComponent);
    component = fixture.componentInstance;
  });

  it('should create and load oics list on init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(mockGetOicService.getOic).toHaveBeenCalled();
    expect(component.oics).toEqual(mockOicsData);
  });

  it('should filter oic locally by query', () => {
    fixture.detectChanges();
    component.filterOic({ query: 'Ente 1' });
    expect(component.filteredOic.length).toBe(1);
    expect(component.filteredOic[0].nombre_ente).toBe('Ente 1');
  });

  it('should generate static chart data on genChart', () => {
    fixture.detectChanges();
    component.genChart();
    expect(component.data).toBeDefined();
    expect(component.data.labels[0]).toBe('Procedimientos Iniciados');
    expect(component.data.datasets[0].data).toEqual([300, 50, 100]);
  });

  it('should load kpi and map to chart data structure on loadChart', () => {
    fixture.detectChanges();
    const mockKpiResponse = {
      data: {
        chart: [
          { kpi: 'Iniciados', total_casos: 15 },
          { kpi: 'Concluidos', total_casos: 8 }
        ]
      }
    };
    mockProtectedService.getKpis.and.returnValue(of(mockKpiResponse as any));

    const mockEvent: OicEnte = {
      ente: { id: 'ente-123', nombre_ente: 'Ente 123', siglas_ente: 'E123', data: [] }
    };

    component.loadChart(mockEvent);

    expect(mockProtectedService.getKpis).toHaveBeenCalledWith({ ente_publico: 'ente-123' });
    expect(component.data).toBeDefined();
    expect(component.data.labels).toEqual(['Iniciados (15)', 'Concluidos (8)']);
    expect(component.data.datasets[0].data).toEqual([15, 8]);
  });

  it('should load kpi and map to chart data structure on loadCharFinderSelectedOic', () => {
    fixture.detectChanges();
    const mockKpiResponse = {
      data: {
        chart: [
          { kpi: 'Iniciados', total_casos: 22 }
        ]
      }
    };
    mockProtectedService.getKpis.and.returnValue(of(mockKpiResponse as any));

    const mockEvent: OicInterface = {
      id: 'ente-124', nombre_ente: 'Ente 124', siglas_ente: 'E124', data: []
    };

    component.loadCharFinderSelectedOic(mockEvent);

    expect(mockProtectedService.getKpis).toHaveBeenCalledWith({ ente_publico: 'ente-124' });
    expect(component.data.datasets[0].data).toEqual([22]);
  });
});
