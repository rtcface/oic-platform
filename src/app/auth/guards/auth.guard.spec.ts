import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../../shared/services/shared.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: any;
  let routerMock: any;
  let sharedServiceMock: any;

  beforeEach(() => {
    authServiceMock = {
      verify_authentication: jasmine.createSpy('verify_authentication')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    sharedServiceMock = {};

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SharedService, useValue: sharedServiceMock }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should return true if user is authenticated', (done) => {
      authServiceMock.verify_authentication.and.returnValue(of(true));

      const result = guard.canActivate({} as any, {} as any);
      if (typeof result === 'boolean') {
        expect(result).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      } else {
        (result as any).subscribe((val: boolean) => {
          expect(val).toBeTrue();
          expect(routerMock.navigate).not.toHaveBeenCalled();
          done();
        });
      }
    });

    it('should return false and navigate to login if user is not authenticated', (done) => {
      authServiceMock.verify_authentication.and.returnValue(of(false));

      const result = guard.canActivate({} as any, {} as any);
      if (typeof result === 'boolean') {
        expect(result).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['./auth/login']);
        done();
      } else {
        (result as any).subscribe((val: boolean) => {
          expect(val).toBeFalse();
          expect(routerMock.navigate).toHaveBeenCalledWith(['./auth/login']);
          done();
        });
      }
    });
  });

  describe('canLoad', () => {
    it('should return true if user is authenticated', (done) => {
      authServiceMock.verify_authentication.and.returnValue(of(true));

      const result = guard.canLoad({} as any, []);
      if (typeof result === 'boolean') {
        expect(result).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      } else {
        (result as any).subscribe((val: boolean) => {
          expect(val).toBeTrue();
          expect(routerMock.navigate).not.toHaveBeenCalled();
          done();
        });
      }
    });

    it('should return false and navigate to login if user is not authenticated', (done) => {
      authServiceMock.verify_authentication.and.returnValue(of(false));

      const result = guard.canLoad({} as any, []);
      if (typeof result === 'boolean') {
        expect(result).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['./auth/login']);
        done();
      } else {
        (result as any).subscribe((val: boolean) => {
          expect(val).toBeFalse();
          expect(routerMock.navigate).toHaveBeenCalledWith(['./auth/login']);
          done();
        });
      }
    });
  });
});
