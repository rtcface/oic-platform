import { TestBed } from '@angular/core/testing';

import { TypePortalGuard } from './type-portal.guard';

describe('TypePortalGuard', () => {
  let guard: TypePortalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TypePortalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
