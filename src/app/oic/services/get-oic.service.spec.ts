import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Apollo } from 'apollo-angular';
import { GetOicService } from './get-oic.service';
import { of } from 'rxjs';

describe('GetOicService', () => {
  let service: GetOicService;
  let httpMock: HttpTestingController;
  let apolloSpy: jasmine.SpyObj<Apollo>;

  beforeEach(() => {
    apolloSpy = jasmine.createSpyObj('Apollo', ['query']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        GetOicService,
        { provide: Apollo, useValue: apolloSpy }
      ]
    });

    service = TestBed.inject(GetOicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch oic data from local json via getOic', () => {
    const dummyOic = { id: '1', nombre_ente: 'Ente Test', siglas_ente: 'ET', data: [] };

    service.getOic().subscribe(data => {
      expect(data).toEqual(dummyOic as any);
    });

    const req = httpMock.expectOne('assets/db/entes.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyOic);
  });

  it('should fetch menu plan via getMenu', () => {
    const dummyMenu = { label: 'Plan 1', data: 'data' };

    service.getMenu().subscribe(data => {
      expect(data).toEqual(dummyMenu as any);
    });

    const req = httpMock.expectOne('assets/db/plan-trabajo.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMenu);
  });

  it('should query apollo via getOicFromGraph', () => {
    const mockQueryResult = { data: { items: [] } };
    apolloSpy.query.and.returnValue(of(mockQueryResult as any));

    service.getOicFromGraph('test-param').subscribe(res => {
      expect(res).toEqual(mockQueryResult as any);
    });

    expect(apolloSpy.query).toHaveBeenCalled();
    const queryCallArgs = apolloSpy.query.calls.mostRecent().args[0];
    expect(queryCallArgs.variables).toEqual({ ente: 'test-param' });
    expect(queryCallArgs.fetchPolicy).toBe('no-cache');
  });

  it('should query apollo via getWorkPlanFromGraph', () => {
    const mockPlanResult = { data: { data: {} } };
    apolloSpy.query.and.returnValue(of(mockPlanResult as any));

    const mockFilter = { ente: { ente_publico: 'ente-1' } };
    service.getWorkPlanFromGraph(mockFilter).subscribe(res => {
      expect(res).toEqual(mockPlanResult as any);
    });

    expect(apolloSpy.query).toHaveBeenCalled();
    const queryCallArgs = apolloSpy.query.calls.mostRecent().args[0];
    expect(queryCallArgs.variables).toEqual(mockFilter);
    expect(queryCallArgs.errorPolicy).toBe('all');
    expect(queryCallArgs.fetchPolicy).toBe('no-cache');
  });
});
