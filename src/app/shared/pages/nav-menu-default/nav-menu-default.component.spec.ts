import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NavMenuDefaultComponent } from './nav-menu-default.component';
import { AuthService } from '../../../auth/services/auth.service';

@Component({ selector: 'app-card-default', template: '' })
class MockCardDefaultComponent {}

describe('NavMenuDefaultComponent', () => {
  let component: NavMenuDefaultComponent;
  let fixture: ComponentFixture<NavMenuDefaultComponent>;
  let authServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn: { login: { token: 'mock-token' } }
    };

    await TestBed.configureTestingModule({
      imports: [ PrimeNgModule, RouterTestingModule ],
      declarations: [ NavMenuDefaultComponent, MockCardDefaultComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize menu items on ngOnInit', () => {
    expect(component.items.length).toBe(5);
    expect(component.items[0].label).toBe('Inicio');
    expect(component.items[1].label).toBe('Datos del OIC');
    expect(component.items[2].label).toBe('Plan de Trabajo');
  });

  it('should return isLoggedIn from authService', () => {
    expect(component.isLoggedIn).toEqual(authServiceMock.isLoggedIn);
  });
});
