import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrevencionAdminComponent } from './prevencion-admin.component';
import { PrevencionModule } from '../prevencion.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

describe('PrevencionAdminComponent', () => {
  let component: PrevencionAdminComponent;
  let fixture: ComponentFixture<PrevencionAdminComponent>;
  let messageService: MessageService;

  beforeEach(async () => {
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
      providers: [MessageService]
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
    expect(component.activityForm.get('date')).toBeDefined();
    expect(component.activityForm.get('dependency')).toBeDefined();
  });

  it('should initialize complaint form', () => {
    expect(component.complaintForm).toBeDefined();
    expect(component.complaintForm.get('municipality')).toBeDefined();
    expect(component.complaintForm.get('total')).toBeDefined();
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

  it('should call submitActivity when activity form is submitted', () => {
    spyOn(component, 'submitActivity');
    component.activityForm.setValue({ name: 'Test', date: '2023-01-01', dependency: 'OIC Test' });
    fixture.detectChanges();
    
    const forms = fixture.nativeElement.querySelectorAll('form');
    forms[0].dispatchEvent(new Event('submit'));
    expect(component.submitActivity).toHaveBeenCalled();
  });

  it('should call submitComplaint when complaint form is submitted', () => {
    spyOn(component, 'submitComplaint');
    component.complaintForm.setValue({ municipality: 'Xalapa', total: 10 });
    fixture.detectChanges();
    
    const forms = fixture.nativeElement.querySelectorAll('form');
    forms[1].dispatchEvent(new Event('submit'));
    expect(component.submitComplaint).toHaveBeenCalled();
  });

  it('should display a success message when activity form is successfully submitted', () => {
    spyOn(messageService, 'add');
    component.activityForm.setValue({ name: 'Test', date: '2023-01-01', dependency: 'OIC Test' });
    component.submitActivity();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success'
    }));
    expect(component.activityForm.value).toEqual({ name: null, date: null, dependency: null });
  });

  it('should display a success message when complaint form is successfully submitted', () => {
    spyOn(messageService, 'add');
    component.complaintForm.setValue({ municipality: 'Xalapa', total: 10 });
    component.submitComplaint();
    
    expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'success'
    }));
    expect(component.complaintForm.value).toEqual({ municipality: null, total: null });
  });
});
