import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdmQuejasComponent } from './adm-quejas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../../../shared/services/shared.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';

describe('AdmQuejasComponent', () => {
  let component: AdmQuejasComponent;
  let fixture: ComponentFixture<AdmQuejasComponent>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let messageSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['save_Queja', 'get_Quejas', 'delete_Queja']);
    messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    sharedServiceSpy.get_Quejas.and.returnValue(of({ data: { getQuejas: [] } }));

    await TestBed.configureTestingModule({
      declarations: [ AdmQuejasComponent ],
      imports: [ ReactiveFormsModule, InputNumberModule ],
      providers: [
        { provide: SharedService, useValue: sharedServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .overrideComponent(AdmQuejasComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmQuejasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should not call save_Queja when submitting invalid form', () => {
    component.onSubmit();
    expect(sharedServiceSpy.save_Queja).not.toHaveBeenCalled();
  });

  it('should be valid when filled correctly and submit successfully', () => {
    component.registerForm.controls['procedentes'].setValue(10);
    component.registerForm.controls['improcedentes'].setValue(5);
    expect(component.registerForm.valid).toBeTruthy();

    sharedServiceSpy.save_Queja.and.returnValue(of({ data: { saveQueja: { success: true } }, loading: false } as any));

    component.onSubmit();

    expect(sharedServiceSpy.save_Queja).toHaveBeenCalled();
    expect(messageSpy.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
  });
});
