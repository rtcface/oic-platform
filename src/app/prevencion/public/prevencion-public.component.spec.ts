import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrevencionPublicComponent } from './prevencion-public.component';
import { PrevencionModule } from '../prevencion.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { GetOicService } from '../../oic/services/get-oic.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { OicInterface } from '../../oic/models/oic.interface';
import { PrevencionService } from '../services/prevencion.service';
import { SharedService } from 'src/app/shared/services/shared.service';

describe('PrevencionPublicComponent', () => {
  let component: PrevencionPublicComponent;
  let fixture: ComponentFixture<PrevencionPublicComponent>;
  let prevencionServiceSpy: jasmine.SpyObj<PrevencionService>;

  beforeEach(async () => {
    prevencionServiceSpy = jasmine.createSpyObj('PrevencionService', ['getActivities', 'getComplaints']);

    prevencionServiceSpy.getActivities.and.returnValue(of([
      { name: 'Act1', date: '2023-01-01', dependency: 'OIC Test', evidence: [] },
      { name: 'Act2', date: '2023-01-02', dependency: 'Other', evidence: [] }
    ]));
    
    prevencionServiceSpy.getComplaints.and.returnValue(of([
      { municipality: 'OIC Test', total: 15, procedentes: 10, improcedentes: 5 },
      { municipality: 'Other', total: 8, procedentes: 5, improcedentes: 3 }
    ]));

    await TestBed.configureTestingModule({
      imports: [PrevencionModule, HttpClientTestingModule, RouterTestingModule, ApolloTestingModule],
      declarations: [PrevencionPublicComponent],
      providers: [
        { provide: GetOicService, useValue: { getOicFromGraph: () => of([]) } },
        { provide: PrevencionService, useValue: prevencionServiceSpy },
        { provide: SharedService, useValue: { get_menu_portal: () => [] } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevencionPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the two required tabs', () => {
    const tabs = fixture.nativeElement.querySelectorAll('.p-tabview-nav-link');
    expect(tabs.length).toBe(2);
    expect(tabs[0].textContent).toContain('Evidencia de Actividades');
    expect(tabs[1].textContent).toContain('Quejas por Violencia Institucional');
  });

  it('should contain app-finder-oic', () => {
    const finder = fixture.nativeElement.querySelector('app-finder-oic');
    expect(finder).toBeTruthy();
  });

  it('should contain p-table in the first tab for activities data', () => {
    const table = fixture.nativeElement.querySelector('p-table');
    expect(table).toBeTruthy();
  });

  it('should contain p-chart in the second tab for complaints data', () => {
    component.onOicSelected({ id: '1', nombre_ente: 'OIC Test', siglas_ente: 'OT', data: [] });
    fixture.detectChanges();
    const chart = fixture.nativeElement.querySelector('p-chart');
    expect(chart).toBeTruthy();
  });

  it('should initialize data on load', (done) => {
    component.activities$.subscribe(activities => {
      expect(activities.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should filter activities and chart data when onSelectedOicChange is emitted', (done) => {
    const finderDebugElement = fixture.debugElement.query(By.css('app-finder-oic'));
    const testOic: OicInterface = {
      id: '1',
      nombre_ente: 'OIC Test',
      siglas_ente: 'OT',
      data: []
    };

    finderDebugElement.triggerEventHandler('onSelectedOicChange', testOic);
    fixture.detectChanges();

    component.activities$.subscribe(activities => {
      expect(activities.length).toBe(1);
      expect(activities[0].dependency).toBe('OIC Test');
      done();
    });
  });

  it('should reset filter when onSelectedOicChange emits null/undefined', (done) => {
    component.onOicSelected(null as any);
    fixture.detectChanges();

    component.activities$.subscribe(activities => {
      expect(activities.length).toBe(2);
      done();
    });
  });
});
