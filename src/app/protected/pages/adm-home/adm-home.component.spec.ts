import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { AdmHomeComponent } from './adm-home.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmHomeComponent', () => {
  let component: AdmHomeComponent;
  let fixture: ComponentFixture<AdmHomeComponent>;
  let authServiceSpy: any;
  let sharedServiceSpy: any;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<any>({ type: 'oic' });

    authServiceSpy = {
      get da_role() { return 'admin'; },
      get isLoggedIn() {
        return {
          verify_authentication: {
            user: {
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'avatar_url'
            }
          }
        };
      }
    };

    sharedServiceSpy = {
      get_menu_portal: jasmine.createSpy('get_menu_portal').and.returnValue([{ label: 'Home' }])
    };

    await TestBed.configureTestingModule({
      declarations: [ AdmHomeComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: queryParamsSubject.asObservable() } },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize OIC menu when query param type is oic', () => {
    expect(component.header_title).toBeDefined();
    expect(component.items.length).toBe(1);
    expect(sharedServiceSpy.get_menu_portal).toHaveBeenCalled();
  });

  it('should initialize PLT menu when query param type is plt', () => {
    queryParamsSubject.next({ type: 'plt' });
    fixture.detectChanges();
    expect(component.header_title).toBeDefined();
    expect(component.items.length).toBe(1);
  });

  it('should set user data when logged in', () => {
    expect(component.user.name).toBe('John Doe');
    expect(component.user.email).toBe('john@example.com');
    expect(component.user.isLogin).toBeTrue();
  });
  
  it('should set default user data when not logged in', () => {
    // Reset component and set isLoggedIn to undefined
    const mockAuth = TestBed.inject(AuthService);
    spyOnProperty(mockAuth, 'isLoggedIn', 'get').and.returnValue(undefined);
    
    const newFixture = TestBed.createComponent(AdmHomeComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    
    expect(newComponent.user.name).toBe('User');
    expect(newComponent.user.isLogin).toBeFalse();
  });
});
