import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NavMenuComponent } from './nav-menu.component';

@Component({ selector: 'app-card', template: '' })
class MockCardComponent {
  @Input() user: any;
  @Output() onClear = new EventEmitter<boolean>();
}

describe('NavMenuComponent', () => {
  let component: NavMenuComponent;
  let fixture: ComponentFixture<NavMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PrimeNgModule, RouterTestingModule ],
      declarations: [ NavMenuComponent, MockCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavMenuComponent);
    component = fixture.componentInstance;
    component.items = [{ label: 'Home', icon: 'pi pi-home' }];
    component.user = { name: 'John Doe', email: 'john@doe.com', avatar: '', isLogin: true };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should react to items input changes via ngOnChanges', () => {
    const newItems = [{ label: 'Dashboard', icon: 'pi pi-chart-bar' }];
    
    component.ngOnChanges({
      items: new SimpleChange(component.items, newItems, false)
    });

    expect(component.items).toEqual(newItems);
  });

  it('should clear menu items when clearMenu() is called', () => {
    component.clearMenu();
    expect(component.items).toEqual([]);
  });

  it('should render nav bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.nav-bar')).toBeTruthy();
  });
});
