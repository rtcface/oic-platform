import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardMenuComponent } from './card-menu.component';

describe('CardMenuComponent', () => {
  let component: CardMenuComponent;
  let fixture: ComponentFixture<CardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and icon', () => {
    component.title = 'Microsite Title';
    component.uri_icon = 'assets/img/icon.png';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title-portal')?.textContent).toContain('Microsite Title');
    
    const img = compiled.querySelector('img') as HTMLImageElement;
    expect(img.src).toContain('assets/img/icon.png');
  });
});
