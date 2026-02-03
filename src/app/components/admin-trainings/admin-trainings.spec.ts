import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrainings } from './admin-trainings';

describe('AdminTrainings', () => {
  let component: AdminTrainings;
  let fixture: ComponentFixture<AdminTrainings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTrainings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTrainings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
