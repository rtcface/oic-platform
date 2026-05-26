import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormAddMemberComponent } from './form-add-member.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

describe('FormAddMemberComponent', () => {
  let component: FormAddMemberComponent;
  let fixture: ComponentFixture<FormAddMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAddMemberComponent ],
      imports: [
        InputTextModule,
        ButtonModule,
        RippleModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render fields', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#inputName')).toBeTruthy();
    expect(compiled.querySelector('#inputEmail')).toBeTruthy();
    expect(compiled.querySelector('#inputPhone')).toBeTruthy();
    expect(compiled.querySelector('#inputCharge')).toBeTruthy();
  });
});
