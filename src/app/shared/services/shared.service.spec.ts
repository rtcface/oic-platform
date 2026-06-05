import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

describe('SharedService', () => {
  let service: SharedService;
  let apolloSpy: jasmine.SpyObj<Apollo>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Apollo', ['query', 'mutate']);
    spy.query.and.returnValue(of({ data: { items: [ { label: 'Admin', icon: 'i', routerLink: '/admin' } ] } }));

    TestBed.configureTestingModule({
      providers: [
        SharedService,
        { provide: Apollo, useValue: spy }
      ]
    });
    service = TestBed.inject(SharedService);
    apolloSpy = TestBed.inject(Apollo) as jasmine.SpyObj<Apollo>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('save_Actividad', () => {
    it('should mutate with Actividad payload and return the response', (done) => {
      const mockActividad = {
        titulo: 'New activity',
        descripcion: 'Testing',
        evidencias: [{ titulo: 'Ev1', archivo: 'b64' }]
      };
      
      const mockResponse = { data: { saveActividad: { success: true } }, loading: false };
      apolloSpy.mutate.and.returnValue(of(mockResponse));

      service.save_Actividad(mockActividad).subscribe((res: any) => {
        expect(res).toEqual(mockResponse);
        expect(apolloSpy.mutate).toHaveBeenCalled();
        const callArgs = apolloSpy.mutate.calls.mostRecent().args[0];
        expect(callArgs.variables).toEqual({ input: mockActividad });
        done();
      });
    });
  });

  describe('save_Queja', () => {
    it('should mutate with Queja payload and return the response', (done) => {
      const mockQueja = {
        procedentes: 10,
        improcedentes: 5
      };
      
      const mockResponse = { data: { saveQueja: { success: true } }, loading: false };
      apolloSpy.mutate.and.returnValue(of(mockResponse));

      service.save_Queja(mockQueja).subscribe((res: any) => {
        expect(res).toEqual(mockResponse);
        expect(apolloSpy.mutate).toHaveBeenCalled();
        const callArgs = apolloSpy.mutate.calls.mostRecent().args[0];
        expect(callArgs.variables).toEqual({ input: mockQueja });
        done();
      });
    });
  });

  describe('add_Evidencia', () => {
    it('should mutate with activity ID and evidence payload', (done) => {
      const activityId = 'act-123';
      const mockEvidence = { titulo: 'Ev1', archivo: 'b64' };
      const mockResponse = { data: { addEvidencia: { success: true } }, loading: false };
      apolloSpy.mutate.and.returnValue(of(mockResponse));

      service.add_Evidencia(activityId, mockEvidence).subscribe((res: any) => {
        expect(res).toEqual(mockResponse);
        expect(apolloSpy.mutate).toHaveBeenCalled();
        const callArgs = apolloSpy.mutate.calls.mostRecent().args[0];
        expect(callArgs.variables).toEqual({ actividadId: activityId, input: mockEvidence });
        done();
      });
    });
  });

  describe('get_Actividades', () => {
    it('should query getActividades and return the response', (done) => {
      const mockResponse = { data: { getActividades: [] }, loading: false };
      apolloSpy.query.and.returnValue(of(mockResponse as any));

      service.get_Actividades().subscribe((res: any) => {
        expect(res).toEqual(mockResponse);
        expect(apolloSpy.query).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('get_menu_portal', () => {
    it('should return /prevencion/public for Prevencion tab when isAuth is false', (done) => {
      apolloSpy.query.and.returnValue(of({
        data: {
          items: [
            { label: 'Prevención', icon: 'pi pi-shield', routerLink: '/prevencion/public' }
          ]
        }
      } as any));

      const params = { role: 'user', portal: 'oic' };
      const items = service.get_menu_portal(params, {}, false);

      setTimeout(() => {
        expect(items.length).toBeGreaterThan(0);
        const prevencionItem = items.find(i => i.label === 'Prevención');
        expect(prevencionItem).toBeDefined();
        expect(prevencionItem?.routerLink).toBe('/prevencion/public');
        done();
      });
    });

    it('should return /protected/prevencion for Prevencion tab when isAuth is true', (done) => {
      apolloSpy.query.and.returnValue(of({
        data: {
          items: [
            { label: 'Prevención', icon: 'pi pi-shield', routerLink: '/protected/prevencion' }
          ]
        }
      } as any));

      const params = { role: 'admin', portal: 'oic' };
      const items = service.get_menu_portal(params, {}, true);

      setTimeout(() => {
        expect(items.length).toBeGreaterThan(0);
        const prevencionItem = items.find(i => i.label === 'Prevención');
        expect(prevencionItem).toBeDefined();
        expect(prevencionItem?.routerLink).toBe('/protected/prevencion');
        done();
      });
    });
  });
});
