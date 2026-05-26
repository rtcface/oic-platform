import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdmUsersComponent } from './adm-users.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmUsersComponent', () => {
  let component: AdmUsersComponent;
  let fixture: ComponentFixture<AdmUsersComponent>;
  let authServiceSpy: any;
  let sharedServiceSpy: any;
  let messageServiceSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      idUserAuth: 'user-123',
      get_tree_colaboradores: jasmine.createSpy('get_tree_colaboradores').and.returnValue(of({
        data: {
          getColaboresTreeData: {
            data: 'colab-data',
            label: 'Root Node'
          }
        }
      }))
    };

    sharedServiceSpy = {
      save_Colaborador: jasmine.createSpy('save_Colaborador').and.returnValue(of({
        data: {
          registerColaborador: {
            haveError: false,
            Err: null
          }
        }
      })),
      delete_user: jasmine.createSpy('delete_user').and.returnValue(of({
        data: { id: 'deleted-user-123' }
      })),
      update_Colaborador: jasmine.createSpy('update_Colaborador').and.returnValue(of({
        data: {
          updateColaborador: {
            haveError: false,
            Err: null
          }
        }
      }))
    };

    messageServiceSpy = {
      add: jasmine.createSpy('add'),
      messageObserver: of(),
      clearObserver: of()
    };

    routerSpy = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [ AdmUsersComponent ],
      imports: [ PrimeNgModule, NoopAnimationsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(AdmUsersComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load collaborator tree on init', () => {
    expect(component).toBeTruthy();
    expect(authServiceSpy.get_tree_colaboradores).toHaveBeenCalled();
    expect(component.data.length).toBe(1);
    expect(component.data[0].label).toBe('Root Node');
  });

  it('should handle get_tree_colaboradores returning empty tree', () => {
    authServiceSpy.get_tree_colaboradores.and.returnValue(of({
      data: {
        getColaboresTreeData: {
          data: null
        }
      }
    }));
    component.loadTreeFromBoss();
    expect(component.data.length).toBe(0);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should open dialog on showDialog or node select', () => {
    expect(component.display).toBeFalse();
    component.onNodeSelect({});
    expect(component.display).toBeTrue();
  });

  it('should save collaborator successfully', () => {
    const mockColab = { name: 'New Colab', parentId: '' } as any;
    component.save(mockColab);
    
    expect(mockColab.parentId).toBe('user-123');
    expect(sharedServiceSpy.save_Colaborador).toHaveBeenCalledWith(mockColab);
    expect(component.isSaved).toBeTrue();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle save collaborator returning error in payload', () => {
    sharedServiceSpy.save_Colaborador.and.returnValue(of({
      data: {
        registerColaborador: {
          haveError: true,
          Err: 'Validation Error'
        }
      }
    }));
    const mockColab = { name: 'New Colab', parentId: '' } as any;
    component.save(mockColab);
    
    expect(component.isSaved).toBeFalse();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle save error gracefully', () => {
    sharedServiceSpy.save_Colaborador.and.returnValue(throwError(() => new Error('Save error')));
    const mockColab = { name: 'New Colab', parentId: '' } as any;
    component.save(mockColab);
    expect(component.isSaved).toBeFalse();
  });

  it('should delete user successfully', () => {
    component.delete({ id: 'deleted-123' } as any);
    expect(sharedServiceSpy.delete_user).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle delete user returning empty id in payload', () => {
    sharedServiceSpy.delete_user.and.returnValue(of({
      data: { id: '' }
    }));
    component.delete({ id: 'deleted-123' } as any);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle delete user error gracefully', () => {
    sharedServiceSpy.delete_user.and.returnValue(throwError(() => new Error('Delete error')));
    component.delete({ id: 'deleted-123' } as any);
    expect(sharedServiceSpy.delete_user).toHaveBeenCalled();
  });

  it('should update collaborator successfully', () => {
    component.update({ id: '123', name: 'Updated' } as any);
    expect(sharedServiceSpy.update_Colaborador).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle update collaborator returning error in payload', () => {
    sharedServiceSpy.update_Colaborador.and.returnValue(of({
      data: {
        updateColaborador: {
          haveError: true,
          Err: 'Update Error'
        }
      }
    }));
    component.update({ id: '123', name: 'Updated' } as any);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle update collaborator error gracefully', () => {
    sharedServiceSpy.update_Colaborador.and.returnValue(throwError(() => new Error('Update error')));
    component.update({ id: '123', name: 'Updated' } as any);
    expect(sharedServiceSpy.update_Colaborador).toHaveBeenCalled();
  });

  it('should open update dialog with user data', () => {
    const mockUser = { id: '123', name: 'Test User' } as any;
    component.updateUserData(mockUser);
    expect(component.userEdit).toEqual(mockUser);
    expect(component.display).toBeTrue();
  });
});
