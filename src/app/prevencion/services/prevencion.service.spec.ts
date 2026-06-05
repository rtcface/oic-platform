import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { PrevencionService } from './prevencion.service';
import { Activity, Complaint } from '../models/prevencion.interface';

describe('PrevencionService', () => {
  let service: PrevencionService;
  let controller: ApolloTestingController;
  let apollo: Apollo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ApolloModule,
        ApolloTestingModule
      ],
      providers: [
        PrevencionService
      ]
    });

    service = TestBed.inject(PrevencionService);
    controller = TestBed.inject(ApolloTestingController);
    apollo = TestBed.inject(Apollo);

    // Manually ensure the default client is initialized for tests to avoid "Client has not been defined yet"
    try {
      apollo.create({
        link: new ApolloLink((operation) => (controller as any).handle(operation)),
        cache: new InMemoryCache({
          addTypename: false
        })
      });
    } catch (err) {
      // Client might already be defined
    }
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getActivities', () => {
    it('should query activities and map the response correctly', (done) => {
      const mockBackendResponse = {
        data: {
          getActividades: [
            {
              id: '1',
              titulo: 'Test Activity 1',
              descripcion: '',
              createdAt: '2026-06-01T00:00:00Z',
              ente_publico: {
                nombre_ente: 'Department A'
              },
              evidencias: [
                {
                  titulo: 'Image Ev',
                  archivo: 'http://test.com/image.png'
                },
                {
                  titulo: 'PDF Ev',
                  archivo: 'http://test.com/doc.pdf'
                }
              ]
            }
          ]
        }
      };

      service.getActivities().subscribe(activities => {
        expect(activities.length).toBe(1);
        expect(activities[0]).toEqual({
          name: 'Test Activity 1',
          date: '2026-06-01T00:00:00Z',
          dependency: 'Department A',
          evidence: [
            { name: 'Image Ev', url: 'http://test.com/image.png', type: 'photo' },
            { name: 'PDF Ev', url: 'http://test.com/doc.pdf', type: 'document' }
          ]
        });
        done();
      });

      const op = controller.expectOne('GetActividades');
      expect(op.operation.operationName).toBe('GetActividades');
      op.flush(mockBackendResponse);
    });

    it('should handle empty activities or null/undefined evidence list gracefully', (done) => {
      const mockBackendResponse = {
        data: {
          getActividades: [
            {
              id: '2',
              titulo: 'Test Activity 2',
              descripcion: '',
              createdAt: '2026-06-02T00:00:00Z',
              ente_publico: null,
              evidencias: null
            }
          ]
        }
      };

      service.getActivities().subscribe(activities => {
        expect(activities.length).toBe(1);
        expect(activities[0]).toEqual({
          name: 'Test Activity 2',
          date: '2026-06-02T00:00:00Z',
          dependency: '',
          evidence: []
        });
        done();
      });

      const op = controller.expectOne('GetActividades');
      op.flush(mockBackendResponse);
    });
  });

  describe('getComplaints', () => {
    it('should query complaints and map the response correctly', (done) => {
      const mockBackendResponse = {
        data: {
          getQuejas: [
            {
              id: '1',
              procedentes: 12,
              improcedentes: 8,
              ente_publico: {
                nombre_ente: 'Municipality X'
              }
            }
          ]
        }
      };

      service.getComplaints().subscribe(complaints => {
        expect(complaints.length).toBe(1);
        expect(complaints[0]).toEqual({
          municipality: 'Municipality X',
          procedentes: 12,
          improcedentes: 8,
          total: 20
        });
        done();
      });

      const op = controller.expectOne('GetQuejas');
      expect(op.operation.operationName).toBe('GetQuejas');
      op.flush(mockBackendResponse);
    });
  });

  describe('saveActivity', () => {
    it('should send the correct mutation and variables and map success correctly', (done) => {
      const inputActivity: Activity = {
        name: 'New Activity',
        date: '2026-06-05',
        dependency: 'Some Dept',
        evidence: [
          { name: 'Photo Ev', url: 'http://test.com/photo.jpg', type: 'photo' }
        ]
      };

      const mockBackendResponse = {
        data: {
          saveActividad: {
            id: 'new-activity-id',
            success: true
          }
        }
      };

      service.saveActivity(inputActivity).subscribe(success => {
        expect(success).toBeTrue();
        done();
      });

      const op = controller.expectOne('SaveActividad');
      expect(op.operation.operationName).toBe('SaveActividad');
      expect(op.operation.variables['input']).toEqual({
        titulo: 'New Activity',
        descripcion: '',
        evidencias: [
          { titulo: 'Photo Ev', archivo: 'http://test.com/photo.jpg' }
        ]
      });
      op.flush(mockBackendResponse);
    });

    it('should map success by id if success is falsy or missing in response', (done) => {
      const inputActivity: Activity = {
        name: 'New Activity without evidence',
        date: '2026-06-05',
        dependency: 'Some Dept'
      };

      const mockBackendResponse = {
        data: {
          saveActividad: {
            id: 'new-activity-id',
            success: false
          }
        }
      };

      service.saveActivity(inputActivity).subscribe(success => {
        expect(success).toBeTrue();
        done();
      });

      const op = controller.expectOne('SaveActividad');
      expect(op.operation.variables['input']).toEqual({
        titulo: 'New Activity without evidence',
        descripcion: '',
        evidencias: []
      });
      op.flush(mockBackendResponse);
    });
  });

  describe('saveComplaint', () => {
    it('should send the correct mutation and variables and map success correctly', (done) => {
      const inputComplaint: Complaint = {
        municipality: 'Municipality Y',
        procedentes: 5,
        improcedentes: 10,
        total: 15
      };

      const mockBackendResponse = {
        data: {
          saveQueja: {
            id: 'new-complaint-id',
            success: true
          }
        }
      };

      service.saveComplaint(inputComplaint).subscribe(success => {
        expect(success).toBeTrue();
        done();
      });

      const op = controller.expectOne('SaveQueja');
      expect(op.operation.operationName).toBe('SaveQueja');
      expect(op.operation.variables['input']).toEqual({
        procedentes: 5,
        improcedentes: 10
      });
      op.flush(mockBackendResponse);
    });
  });
});
