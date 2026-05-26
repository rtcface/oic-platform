import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AdmPltComiteComponent } from './adm-plt-comite.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdmPltComiteComponent', () => {
  let component: AdmPltComiteComponent;
  let fixture: ComponentFixture<AdmPltComiteComponent>;
  let authServiceSpy: any;
  let sharedServiceSpy: any;
  let messageServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      idEnteAuth: 'ente-123',
      get_tree_comite: jasmine.createSpy('get_tree_comite').and.returnValue(of({
        data: {
          TreeColaboradoresData: {
            data: 'some-data',
            label: 'Comite Root'
          }
        }
      }))
    };

    sharedServiceSpy = {
      get_president: jasmine.createSpy('get_president').and.returnValue(of({
        data: {
          PresidetByEnte: {
            id: 'president-123'
          }
        }
      })),
      save_Member: jasmine.createSpy('save_Member').and.returnValue(of({
        data: { id: 'member-123' }
      })),
      save_President: jasmine.createSpy('save_President').and.returnValue(of({
        data: { id: 'president-123' }
      })),
      delete_member: jasmine.createSpy('delete_member').and.returnValue(of({
        data: { id: 'deleted-123' }
      })),
      update_Member: jasmine.createSpy('update_Member').and.returnValue(of({
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

    await TestBed.configureTestingModule({
      declarations: [ AdmPltComiteComponent ],
      imports: [ PrimeNgModule, NoopAnimationsModule ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(AdmPltComiteComponent, {
      set: {
        providers: [
          { provide: MessageService, useValue: messageServiceSpy }
        ]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmPltComiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load committee tree & president on init', () => {
    expect(component).toBeTruthy();
    expect(authServiceSpy.get_tree_comite).toHaveBeenCalled();
    expect(sharedServiceSpy.get_president).toHaveBeenCalledWith('ente-123');
    expect(component.id_president).toBe('president-123');
    expect(component.data.length).toBe(1);
  });

  it('should handle get_tree_comite returning empty data', () => {
    authServiceSpy.get_tree_comite.and.returnValue(of({
      data: {
        TreeColaboradoresData: {
          data: null
        }
      }
    }));
    component.loadTreeFromBoss();
    expect(component.data.length).toBe(0);
  });

  it('should handle get_tree_comite error gracefully', () => {
    authServiceSpy.get_tree_comite.and.returnValue(throwError(() => new Error('Tree error')));
    component.loadTreeFromBoss();
    // Should not throw and print log
  });

  it('should open dialog on showDialog or node select', () => {
    expect(component.display).toBeFalse();
    component.onNodeSelect({});
    expect(component.display).toBeTrue();
  });

  it('should save a member if parent president exists', () => {
    component.id_president = 'president-123';
    const colaborador = { parentId: '', name: 'John Member' } as any;
    component.save(colaborador);
    
    expect(colaborador.parentId).toBe('president-123');
    expect(sharedServiceSpy.save_Member).toHaveBeenCalledWith(colaborador);
    expect(component.isSaved).toBeTrue();
  });

  it('should save as president if no president exists', () => {
    component.id_president = '';
    const colaborador = { parentId: '', name: 'John President' } as any;
    component.save(colaborador);
    
    expect(colaborador.parentId).toBe('');
    expect(sharedServiceSpy.save_President).toHaveBeenCalledWith(colaborador, 'ente-123');
    expect(component.isSaved).toBeTrue();
  });

  it('should handle save error', () => {
    sharedServiceSpy.save_Member.and.returnValue(throwError(() => new Error('Save error')));
    component.id_president = 'president-123';
    const colaborador = { parentId: '', name: 'John Member' } as any;
    component.save(colaborador);
    
    expect(component.isSaved).toBeFalse();
  });

  it('should delete a member', () => {
    component.delete({ id: 'delete-123' } as any);
    expect(sharedServiceSpy.delete_member).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle delete member failing to return id', () => {
    sharedServiceSpy.delete_member.and.returnValue(of({ data: { id: '' } }));
    component.delete({ id: 'delete-123' } as any);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should update a member and show success message', () => {
    component.update({ id: '123', name: 'Updated name' } as any);
    expect(sharedServiceSpy.update_Member).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should handle update error returned in query payload', () => {
    sharedServiceSpy.update_Member.and.returnValue(of({
      data: {
        updateColaborador: {
          haveError: true,
          Err: 'Duplicate entry'
        }
      }
    }));
    component.update({ id: '123', name: 'Updated name' } as any);
    expect(messageServiceSpy.add).toHaveBeenCalled();
  });

  it('should open update dialog with member data', () => {
    const mockUser = { id: '123', name: 'User' } as any;
    component.updateUserData(mockUser);
    expect(component.userEdit).toEqual(mockUser);
    expect(component.display).toBeTrue();
  });
});
