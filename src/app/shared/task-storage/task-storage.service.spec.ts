import { TestBed } from '@angular/core/testing';

import { TaskStorage } from './task-storage.service';

describe('TaskStorage', () => {
  let service: TaskStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
