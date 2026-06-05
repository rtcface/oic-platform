import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrevencionAdminComponent } from './prevencion-admin.component';
import { PrevencionModule } from '../prevencion.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PrevencionService } from '../services/prevencion.service';
import { of } from 'rxjs';

describe('PrevencionAdminComponent', () => {
  let component: PrevencionAdminComponent;
  let fixture: ComponentFixture<PrevencionAdminComponent>;
  let messageService: MessageService;
  let prevencionServiceSpy: jasmine.SpyObj<PrevencionService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let mockAuthService: any;

  beforeEach(async () => {
    prevencionServiceSpy = jasmine.createSpyObj('PrevencionService', ['saveActivity', 'saveComplaint']);
    prevencionServiceSpy.saveActivity.and.returnValue(of(true));
    prevencionServiceSpy.saveComplaint.and.returnValue(of(true));

    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['get_menu_portal']);
    sharedServiceSpy.get_menu_portal.and.returnValue([]);

    mockAuthService = {
      get isLoggedIn() {
        return {
          verify_authentication: {
            user: {
              name: 'Admin User',
              email: 'admin@test.com',
              avatar: 'avatar.png'
            }
          }
        };
      },
      get da_role() {
        return 'admin';
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        PrevencionModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ApolloTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [PrevencionAdminComponent],
      providers: [
        MessageService,
        { provide: PrevencionService, useValue: prevencionServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrevencionAdminComponent);
    component = fixture.componentInstance;
    messageService = fixture.debugElement.injector.get(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize activity form', () => {
    expect(component.activityForm).toBeDefined();
    expect(component.activityForm.get('name')).toBeDefined();
    expect(component.activityForm.get('description')).toBeDefined();
    expect(component.activityForm.get('evidence')).toBeDefined();
  });

  it('should initialize complaint form', () => {
    expect(component.complaintForm).toBeDefined();
    expect(component.complaintForm.get('procedentes')).toBeDefined();
    expect(component.complaintForm.get('improcedentes')).toBeDefined();
  });

  it('should display two forms in the template', () => {
    const forms = fixture.nativeElement.querySelectorAll('form');
    expect(forms.length).toBe(2);
  });

  it('should mark activity form as invalid when empty', () => {
    expect(component.activityForm.valid).toBeFalse();
  });

  it('should mark complaint form as invalid when empty', () => {
    expect(component.complaintForm.valid).toBeFalse();
  });

  it('should add and remove evidence controls', () => {
    expect(component.evidence.length).toBe(0);
    component.addEvidence();
    expect(component.evidence.length).toBe(1);
    expect(component.evidence.at(0).get('name')).toBeDefined();
    expect(component.evidence.at(0).get('url')).toBeDefined();
    
    component.removeEvidence(0);
    expect(component.evidence.length).toBe(0);
  });

  it('should call submitActivity when activity form is submitted', () => {
    spyOn(component, 'submitActivity');
    component.activityForm.patchValue({ name: 'Test', description: 'Test Description' });
    fixture.detectChanges();
    
    const forms = fixture.nativeElement.querySelectorAll('form');
    forms[0].dispatchEvent(new Event('submit'));
    expect(component.submitActivity).toHaveBeenCalled();
  });

  it('should call submitComplaint when complaint form is submitted', () => {
    spyOn(component, 'submitComplaint');
    component.complaintForm.setValue({ procedentes: 5, improcedentes: 2 });
    fixture.detectChanges();
    
    const forms = fixture.nativeElement.querySelectorAll('form');
    forms[1].dispatchEvent(new Event('submit'));
    expect(component.submitComplaint).toHaveBeenCalled();
  });

  it('should display a success message when activity form is successfully submitted', () => {
    spyOn(messageService, 'add');
    component.activityForm.patchValue({ name: 'Test', description: 'Test Description' });
    component.submitActivity();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success'
    }));
    expect(component.activityForm.value.name).toBeNull();
    expect(component.activityForm.value.description).toBeNull();
  });

  it('should display a success message when complaint form is successfully submitted', () => {
    spyOn(messageService, 'add');
    component.complaintForm.setValue({ procedentes: 5, improcedentes: 2 });
    component.submitComplaint();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success'
    }));
    expect(component.complaintForm.value).toEqual({ procedentes: null, improcedentes: null });
  });
});
