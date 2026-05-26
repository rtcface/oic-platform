import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { CardDefaultComponent } from './card-default.component';
import { AuthService } from '../../../auth/services/auth.service';

describe('CardDefaultComponent', () => {
  let component: CardDefaultComponent;
  let fixture: ComponentFixture<CardDefaultComponent>;
  let routerMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    authServiceMock = {
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [ PrimeNgModule ],
      declarations: [ CardDefaultComponent ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout, remove token and navigate to login on login()', () => {
    spyOn(localStorage, 'removeItem');
    
    component.login();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
