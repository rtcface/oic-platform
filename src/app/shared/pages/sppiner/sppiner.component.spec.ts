import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { SppinerComponent } from './sppiner.component';
import { SharedService } from '../../services/shared.service';

describe('SppinerComponent', () => {
  let component: SppinerComponent;
  let fixture: ComponentFixture<SppinerComponent>;
  let isLoadingSubject: BehaviorSubject<boolean>;
  let sharedServiceMock: any;

  beforeEach(async () => {
    isLoadingSubject = new BehaviorSubject<boolean>(false);

    sharedServiceMock = {
      isLoading$: isLoadingSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      declarations: [ SppinerComponent ],
      providers: [
        { provide: SharedService, useValue: sharedServiceMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SppinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display spinner when isLoading$ is false', () => {
    isLoadingSubject.next(false);
    fixture.detectChanges();

    const spinnerDiv = fixture.debugElement.query(By.css('.loading'));
    expect(spinnerDiv).toBeNull();
  });

  it('should display spinner when isLoading$ is true', () => {
    isLoadingSubject.next(true);
    fixture.detectChanges();

    const spinnerDiv = fixture.debugElement.query(By.css('.loading'));
    expect(spinnerDiv).not.toBeNull();
    
    const rippleDiv = fixture.debugElement.query(By.css('.lds-ripple'));
    expect(rippleDiv).not.toBeNull();
  });
});
