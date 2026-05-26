import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

describe('AuthService', () => {
  let service: AuthService;
  let apolloMock: any;
  let sharedServiceMock: any;
  let localStore: { [key: string]: string };

  beforeEach(() => {
    localStore = {};
    spyOn(localStorage, 'getItem').and.callFake((key) => localStore[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key, value) => {
      localStore[key] = value + '';
    });
    spyOn(localStorage, 'removeItem').and.callFake((key) => {
      delete localStore[key];
    });

    apolloMock = {
      client: {
        resetStore: jasmine.createSpy('resetStore').and.returnValue(Promise.resolve())
      },
      mutate: jasmine.createSpy('mutate'),
      query: jasmine.createSpy('query')
    };

    sharedServiceMock = {
      clean_menu: jasmine.createSpy('clean_menu'),
      get_menu_portal: jasmine.createSpy('get_menu_portal').and.returnValue([{ label: 'Test Menu', icon: 'pi pi-home', routerLink: '/test', queryParams: {} }])
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Apollo, useValue: apolloMock },
        { provide: SharedService, useValue: sharedServiceMock }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should successfully login and set local storage & menu', (done) => {
      const mockLoginResponse = {
        data: {
          login: {
            haveError: false,
            Err: null,
            token: 'mock-token',
            user: {
              id: '1',
              name: 'Admin User',
              email: 'admin@test.com',
              role: 'admin',
              colaboradores: [],
              ente_publico: 'ente-1',
              firstSignIn: true
            }
          }
        }
      };

      apolloMock.mutate.and.returnValue(of(mockLoginResponse));

      service.login('admin@test.com', 'password', 'oic').subscribe((res) => {
        expect(apolloMock.mutate).toHaveBeenCalled();
        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
        expect(localStorage.setItem).toHaveBeenCalledWith('portal', 'oic');
        expect(service.role).toBe('admin');
        expect(sharedServiceMock.get_menu_portal).toHaveBeenCalled();
        expect(service.dmenu.length).toBe(1);
        expect(service.dmenu[0].label).toBe('Test Menu');
        done();
      });
    });

    it('should return empty observable or handle errors gracefully on mutation fail', (done) => {
      apolloMock.mutate.and.returnValue(throwError(() => new Error('GraphQL error')));
      
      service.login('admin@test.com', 'password', 'oic').subscribe({
        next: (val) => {
          expect(val).toBeUndefined();
          done();
        },
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        },
        complete: () => {
          expect(true).toBeTrue();
          done();
        }
      });
    });
  });

  describe('verify_authentication', () => {
    it('should return false if token or portal is missing from localStorage', (done) => {
      localStore = {}; // Empty store
      service.verify_authentication().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBeFalse();
        done();
      });
    });

    it('should return true and configure user details when token is valid', (done) => {
      localStore = {
        token: 'valid-token',
        portal: 'oic'
      };

      const mockVerifyResponse = {
        data: {
          verify_authentication: {
            haveError: false,
            Err: null,
            token: 'valid-token',
            user: {
              id: '1',
              name: 'Admin User',
              email: 'admin@test.com',
              role: 'admin',
              colaboradores: [],
              ente_publico: 'ente-1'
            }
          }
        }
      };

      apolloMock.query.and.returnValue(of(mockVerifyResponse));

      service.verify_authentication().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBeTrue();
        expect(service.role).toBe('admin');
        expect(sharedServiceMock.get_menu_portal).toHaveBeenCalled();
        done();
      });
    });

    it('should return false if verify_authentication response contains haveError true', (done) => {
      localStore = {
        token: 'invalid-token',
        portal: 'oic'
      };

      const mockVerifyResponse = {
        data: {
          verify_authentication: {
            haveError: true,
            Err: 'Invalid token',
            token: null,
            user: null
          }
        }
      };

      apolloMock.query.and.returnValue(of(mockVerifyResponse));

      service.verify_authentication().subscribe((isAuthenticated) => {
        expect(isAuthenticated).toBeFalse();
        done();
      });
    });
  });

  describe('logout', () => {
    it('should clear stored credentials, reset Apollo store and clear menu', () => {
      service.role = 'admin';
      
      service.logout();

      expect(service.isLoggedIn).toEqual({} as any);
      expect(service.dmenu).toEqual([]);
      expect(apolloMock.client.resetStore).toHaveBeenCalled();
      expect(sharedServiceMock.clean_menu).toHaveBeenCalled();
    });
  });
});
