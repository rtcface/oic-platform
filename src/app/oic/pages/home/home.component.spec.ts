import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { Constantes } from '../../../../assets/constantes/constantes';
import { HomeComponent } from './home.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

// Mock child components
@Component({ selector: 'app-header', template: '' })
class MockHeaderComponent {
  @Input() title_page = '';
}

@Component({ selector: 'app-nav-menu', template: '' })
class MockNavMenuComponent {
  @Input() items: any[] = [];
  @Input() user: any;
}

@Component({ selector: 'app-footer', template: '' })
class MockFooterComponent {
  @Input() text_footer = '';
}

@Component({ selector: 'app-sppiner', template: '' })
class MockSpinnerComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceMock: any;
  let sharedServiceMock: any;
  let paramsSubject: Subject<any>;

  beforeEach(async () => {
    paramsSubject = new Subject<any>();

    authServiceMock = {
      da_role: 'user'
    };

    sharedServiceMock = {
      get_menu_portal: jasmine.createSpy('get_menu_portal').and.returnValue([
        { label: 'Inicio', icon: 'pi pi-home', routerLink: '/' }
      ])
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        HomeComponent,
        MockHeaderComponent,
        MockNavMenuComponent,
        MockFooterComponent,
        MockSpinnerComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: paramsSubject.asObservable()
          }
        },
        { provide: AuthService, useValue: authServiceMock },
        { provide: SharedService, useValue: sharedServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize header, footer, and query params when type is oic', () => {
    paramsSubject.next({ type: 'oic' });
    fixture.detectChanges();

    expect(component.header_title).toBe(Constantes.header_oic);
    expect(component.footer_title).toBe(Constantes.footer_oic);
    expect(component.queryParams).toEqual({ page: 'oic' });
    expect(sharedServiceMock.get_menu_portal).toHaveBeenCalledWith(
      { portal: 'oic', role: 'user' },
      { page: 'oic' }
    );
    expect(component.items.length).toBe(1);
  });

  it('should initialize header, footer, and query params when type is plt', () => {
    paramsSubject.next({ type: 'plt' });
    fixture.detectChanges();

    expect(component.header_title).toBe(Constantes.header_plt);
    expect(component.footer_title).toBe(Constantes.footer_plt);
    expect(component.queryParams).toEqual({ page: 'plt' });
    expect(sharedServiceMock.get_menu_portal).toHaveBeenCalledWith(
      { portal: 'plt', role: 'user' },
      { page: 'plt' }
    );
    expect(component.items.length).toBe(1);
  });

  it('should unsubscribe from route params on destroy', () => {
    spyOn(component.route, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.route.unsubscribe).toHaveBeenCalled();
  });
});
