import { TestBed } from '@angular/core/testing';

import { OicGraphqlServiceService } from './oic-graphql-service.service';

describe('OicGraphqlServiceService', () => {
  let service: OicGraphqlServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OicGraphqlServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
