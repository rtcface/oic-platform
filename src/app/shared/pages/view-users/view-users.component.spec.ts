import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewUsersComponent } from './view-users.component';
import { CardModule } from 'primeng/card';
import { user_edit } from '../../models/colaborador.interface';

describe('ViewUsersComponent', () => {
  let component: ViewUsersComponent;
  let fixture: ComponentFixture<ViewUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUsersComponent ],
      imports: [ CardModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create and render user details', () => {
    const mockUser: user_edit = {
      id: '1',
      name: 'Arturo Flores',
      email: 'arturo@example.com',
      charge: 'Jefe de Departamento',
      phone: '2461892520'
    };

    component.users = mockUser;
    fixture.componentRef.changeDetectorRef.detectChanges();

    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Arturo Flores');
    expect(compiled.textContent).toContain('Jefe de Departamento');
    expect(compiled.textContent).toContain('2461892520');
    expect(compiled.textContent).toContain('arturo@example.com');
  });

  it('should return true on counterRender', () => {
    expect(component.counterRender()).toBeTrue();
  });
});
