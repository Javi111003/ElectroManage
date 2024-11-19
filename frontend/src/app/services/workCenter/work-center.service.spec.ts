import { TestBed } from '@angular/core/testing';

import { WorkCenterService } from './work-center.service';

describe('WorkCenterService', () => {
  let service: WorkCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
