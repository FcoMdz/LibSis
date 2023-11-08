import { TestBed } from '@angular/core/testing';

import { SQLService } from './sql.service';

describe('SQLService', () => {
  let service: SQLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SQLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
