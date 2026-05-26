import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { ChartModule } from 'primeng/chart';
import { SharedService } from '../../services/shared.service';
import { OicGraphqlServiceService } from 'src/app/graphql/services/oic-graphql-service.service';
import { of } from 'rxjs';
import { Graficas } from '../../models/history.interface';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockOicGraphqlService: jasmine.SpyObj<OicGraphqlServiceService>;

  const mockGraficasData = {
    Data: {
      labels: ['Ente 1', 'Ente 2'],
      datasets: [
        {
          label: 'Porcentaje de avance',
          backgroundColor: ['#EC407A', '#AB47BC'],
          data: [50, 75]
        }
      ]
    }
  } as unknown as Graficas;

  beforeEach(async () => {
    mockSharedService = jasmine.createSpyObj('SharedService', ['getStadistics']);
    mockOicGraphqlService = jasmine.createSpyObj('OicGraphqlServiceService', ['toString']);

    mockSharedService.getStadistics.and.returnValue(of({ data: mockGraficasData } as any));

    await TestBed.configureTestingModule({
      declarations: [ StatisticsComponent ],
      imports: [ ChartModule ],
      providers: [
        { provide: SharedService, useValue: mockSharedService },
        { provide: OicGraphqlServiceService, useValue: mockOicGraphqlService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create and load statistics basicData on init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(mockSharedService.getStadistics).toHaveBeenCalled();
    expect(component.basicData).toEqual(mockGraficasData.Data);
    expect(component.horizontalOptions).toBeDefined();
    expect(component.horizontalOptions.indexAxis).toBe('y');
  });
});
