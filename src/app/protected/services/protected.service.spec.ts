import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { ProtectedService } from './protected.service';

describe('ProtectedService', () => {
  let service: ProtectedService;
  let apolloMock: any;

  beforeEach(() => {
    apolloMock = {
      query: jasmine.createSpy('query').and.returnValue(of({ data: {} })),
      mutate: jasmine.createSpy('mutate').and.returnValue(of({ data: {} }))
    };

    TestBed.configureTestingModule({
      providers: [
        ProtectedService,
        { provide: Apollo, useValue: apolloMock }
      ]
    });
    service = TestBed.inject(ProtectedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call savePlwd and mutate', () => {
    const input = { IdParent: '123', label: 'Test', data: 'data', url: 'url' };
    service.savePlwd(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call updatePlwd and mutate', () => {
    const input = { id: '123', label: 'Test', data: 'data', url: 'url' };
    service.updatePlwd(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call deletePlwd and mutate', () => {
    const input = { id: '123' };
    service.deletePlwd(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call saveKpi and mutate', () => {
    const input = { ente_publico: '123', description: 'desc', kpi: 'kpi', total_casos: 5 };
    service.saveKpi(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call getKpis and query', () => {
    const input = { ente_publico: '123' };
    service.getKpis(input).subscribe();
    expect(apolloMock.query).toHaveBeenCalled();
  });

  it('should call getIntegrationRules and query', () => {
    const input = { ente_publico: '123' };
    service.getIntegrationRules(input).subscribe();
    expect(apolloMock.query).toHaveBeenCalled();
  });

  it('should call updateRules and mutate', () => {
    const input = { ente_publico: '123', id: '1', p1: 'p1' } as any;
    service.updateRules(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call initRules and mutate', () => {
    const input = { ente_publico: '123' };
    service.initRules(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call loadCdoEthic and query', () => {
    const input = { ente_publico: '123' };
    service.loadCdoEthic(input).subscribe();
    expect(apolloMock.query).toHaveBeenCalled();
  });

  it('should call registerCdoEthica and mutate', () => {
    const input = { description: 'desc', url: 'url', ente_publico: '123' };
    service.registerCdoEthica(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call delete_cdo and mutate', () => {
    const input = { id: '123' };
    service.delete_cdo(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });

  it('should call update_cdo and mutate', () => {
    const input = { id: '123', description: 'desc', url: 'url' };
    service.update_cdo(input).subscribe();
    expect(apolloMock.mutate).toHaveBeenCalled();
  });
});



