import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MainCardsComponent } from './main-cards.component';
import { Constantes } from 'src/assets/constantes/constantes';

@Component({ selector: 'app-card-menu', template: '' })
class MockCardMenuComponent {
  @Input() title = '';
  @Input() uri_icon = '';
}

describe('MainCardsComponent', () => {
  let component: MainCardsComponent;
  let fixture: ComponentFixture<MainCardsComponent>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [ MainCardsComponent, MockCardMenuComponent ],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties with Constantes', () => {
    expect(component.uri_icon_oic).toBe(Constantes.uri_icon_oic);
    expect(component.uri_icon_plt).toBe(Constantes.uri_icon_plt);
    expect(component.title_card_oic).toBe(Constantes.title_card_oic);
    expect(component.title_card_plt).toBe(Constantes.title_card_plt);
  });

  it('should navigate to /oic on onClickOic()', () => {
    component.onClickOic();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/oic', 'oic']);
  });

  it('should navigate to /oic/plt on onClickPlt()', () => {
    component.onClickPlt();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/oic/plt', 'plt']);
  });
});
