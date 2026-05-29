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

  describe('get_menu_portal', () => {
    it('should return OIC prevention menu when type == "oic"', () => {
      const params: any = { role: 'PUBLIC', portal: 'PORTAL', type: 'oic' };
      const items = service.get_menu_portal(params, {});
      
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].label).toContain('Prevención');
      expect(items[0].routerLink).toBe('/prevencion/public');
      
      expect(apolloSpy.query.calls.count()).toBe(0);
    });

    it('should call Apollo query when type != "oic"', () => {
      const params: any = { role: 'PUBLIC', portal: 'PORTAL' };
      const items = service.get_menu_portal(params, {});
      
      expect(apolloSpy.query).toHaveBeenCalled();
      // It pushes to this.items after subscription
      expect(items.length).toBeGreaterThan(0);
      expect(items[0].label).toBe('Admin');
    });
  });
});
