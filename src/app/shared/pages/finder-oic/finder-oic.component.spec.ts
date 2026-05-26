import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinderOicComponent } from './finder-oic.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FilterService } from 'primeng/api';
import { GetOicService } from 'src/app/oic/services/get-oic.service';
import { of } from 'rxjs';
import { OicInterface, OicInterfaceGql } from '../../../oic/models/oic.interface';

describe('FinderOicComponent', () => {
  let component: FinderOicComponent;
  let fixture: ComponentFixture<FinderOicComponent>;
  let mockGetOicService: jasmine.SpyObj<GetOicService>;
  let mockFilterService: jasmine.SpyObj<FilterService>;

  const mockOicsData: OicInterfaceGql = {
    id: 'root',
    nombre_ente: 'Root Ente',
    siglas_ente: 'RE',
    items: [
      { id: '1', nombre_ente: 'Ente 1', siglas_ente: 'E1', items: [] },
      { id: '2', nombre_ente: 'Ente 2', siglas_ente: 'E2', items: [] }
    ]
  };

  beforeEach(async () => {
    mockGetOicService = jasmine.createSpyObj('GetOicService', ['getOicFromGraph']);
    mockFilterService = jasmine.createSpyObj('FilterService', ['filter']);

    // Default return for getOicFromGraph
    mockGetOicService.getOicFromGraph.and.returnValue(of({ data: mockOicsData } as any));

    await TestBed.configureTestingModule({
      declarations: [ FinderOicComponent ],
      imports: [ ReactiveFormsModule, AutoCompleteModule ],
      providers: [
        FormBuilder,
        { provide: GetOicService, useValue: mockGetOicService },
        { provide: FilterService, useValue: mockFilterService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinderOicComponent);
    component = fixture.componentInstance;
  });

  it('should create and call getOicFromGraph on init', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(mockGetOicService.getOicFromGraph).toHaveBeenCalledWith('');
    expect(component.oics).toEqual(mockOicsData);
  });

  it('should filter oic locally and fetch data', () => {
    fixture.detectChanges();
    
    // Reset spy calls to track filterOic calls
    mockGetOicService.getOicFromGraph.calls.reset();
    mockGetOicService.getOicFromGraph.and.returnValue(of({ data: mockOicsData } as any));

    component.filterOic({ query: 'Ente' });

    expect(mockGetOicService.getOicFromGraph).toHaveBeenCalledWith('Ente');
    expect(component.filteredOic.length).toBe(2);
    expect(component.filteredOic[0].nombre_ente).toBe('Ente 1');
  });

  it('should emit onEnter and reset form on finderEnte', () => {
    fixture.detectChanges();
    spyOn(component.onEnter, 'emit');
    
    component.finderForm.patchValue({ ente: 'Ente 1' });
    component.finderEnte();

    expect(component.onEnter.emit).toHaveBeenCalledWith({ ente: 'Ente 1' } as any);
    expect(component.finderForm.get('ente')?.value).toBeNull();
  });

  it('should emit onSelectedOicChange and reset form on onSelectOic', () => {
    fixture.detectChanges();
    spyOn(component.onSelectedOicChange, 'emit');

    const selectedItem: OicInterface = {
      id: '1',
      nombre_ente: 'Ente 1',
      siglas_ente: 'E1',
      data: []
    };

    component.finderForm.patchValue({ ente: 'Some text' });
    component.onSelectOic(selectedItem);

    expect(component.selectedOic).toEqual(selectedItem);
    expect(component.onSelectedOicChange.emit).toHaveBeenCalledWith(selectedItem);
    expect(component.finderForm.get('ente')?.value).toBeNull();
  });

  it('should return true on counterRender', () => {
    expect(component.counterRender()).toBeTrue();
  });
});
