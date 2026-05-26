import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { OicGraphqlServiceService } from './oic-graphql-service.service';

describe('OicGraphqlServiceService', () => {
  let service: OicGraphqlServiceService;
  let apolloMock: any;

  beforeEach(() => {
    apolloMock = {
      query: jasmine.createSpy('query').and.returnValue(of({ data: { entes: [] } })),
      mutate: jasmine.createSpy('mutate').and.returnValue(of({ data: {} }))
    };

    TestBed.configureTestingModule({
      providers: [
        OicGraphqlServiceService,
        { provide: Apollo, useValue: apolloMock }
      ]
    });
    service = TestBed.inject(OicGraphqlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


