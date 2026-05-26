import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeComponent } from './tree.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { AuthService } from '../../../auth/services/auth.service';
import { user_edit } from '../../models/colaborador.interface';

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['verify_authentication']);

    await TestBed.configureTestingModule({
      declarations: [ TreeComponent ],
      imports: [ OrganizationChartModule ],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
  });

  it('should create and call purgeTree on ngOnInit', () => {
    spyOn(component, 'purgeTree').and.callThrough();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.purgeTree).toHaveBeenCalled();
    expect(component.data).toEqual([]);
  });

  it('should purge tree data', () => {
    component.data = [{ label: 'Node 1' }];
    component.purgeTree();
    expect(component.data).toEqual([]);
  });

  it('should emit onNodeSelected when onNodeSelect is called', () => {
    spyOn(component.onNodeSelected, 'emit');
    const mockNodeEvent = {
      node: {
        label: 'Director',
        type: 'person',
        data: {
          avatar: 'avatar.png',
          name: 'John Doe'
        },
        name: 'John Doe',
        email: 'john@example.com',
        charge: 'Director',
        phone: '1234567890',
        id: '1'
      }
    };

    component.onNodeSelect(mockNodeEvent as any);

    expect(component.onNodeSelected.emit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      charge: 'Director',
      phone: '1234567890',
      id: '1'
    });
  });

  it('should return true on counterRender', () => {
    expect(component.counterRender()).toBeTrue();
  });
});
