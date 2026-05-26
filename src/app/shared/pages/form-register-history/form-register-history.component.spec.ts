import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormRegisterHistoryComponent } from './form-register-history.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ValidatorsService } from '../../services/validators.service';
import { SimpleChange } from '@angular/core';
import { history_update } from '../../models/history.interface';

describe('FormRegisterHistoryComponent', () => {
  let component: FormRegisterHistoryComponent;
  let fixture: ComponentFixture<FormRegisterHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRegisterHistoryComponent ],
      imports: [
        ReactiveFormsModule,
        CheckboxModule,
        ButtonModule,
        RippleModule
      ],
      providers: [
        FormBuilder,
        ValidatorsService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRegisterHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load historyEdit values into form during ngOnChanges', () => {
    fixture.detectChanges();
    const mockHistory: history_update = {
      id: 'hist-123',
      ente_publico: 'Ente Publico A',
      p1: true,
      p2: false,
      p3: true,
      p4: false,
      p5: true,
      p6: false,
      p7: true,
      p8: false,
      p9: true,
      p10: false,
      p11: true,
      p12: false,
      p13: true,
      p14: false,
      p15: true,
      p16: false
    };

    component.historyEdit = mockHistory;
    component.ngOnChanges({
      historyEdit: new SimpleChange(null, mockHistory, true)
    });

    expect(component.historyForm.get('id')?.value).toBe('hist-123');
    expect(component.historyForm.get('ente_publico')?.value).toBe('Ente Publico A');
    expect(component.historyForm.get('p1')?.value).toBeTrue();
    expect(component.historyForm.get('p2')?.value).toBeFalse();
    expect(component.historyForm.get('p3')?.value).toBeTrue();
    expect(component.historyForm.get('p16')?.value).toBeFalse();
  });

  it('should emit onSave when saveSubmit is called', () => {
    fixture.detectChanges();
    spyOn(component.onSave, 'emit');

    const mockFormValues = {
      id: 'hist-123',
      ente_publico: 'Ente Publico A',
      p1: true,
      p2: true,
      p3: false,
      p4: false,
      p5: false,
      p6: false,
      p7: false,
      p8: false,
      p9: false,
      p10: false,
      p11: false,
      p12: false,
      p13: false,
      p14: false,
      p15: false,
      p16: false
    };

    component.historyForm.setValue(mockFormValues);
    component.saveSubmit();

    expect(component.onSave.emit).toHaveBeenCalledWith(mockFormValues);
  });
});
