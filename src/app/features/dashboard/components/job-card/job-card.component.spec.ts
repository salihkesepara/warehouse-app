import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobCardComponent } from './job-card.component';
import { Job } from '../../models/dashboard.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('JobCardComponent', () => {
  let component: JobCardComponent;
  let fixture: ComponentFixture<JobCardComponent>;

  const mockJob: Job = {
    id: '1',
    sku: 'TEST-SKU-001',
    status: 'pending',
    assignedUser: 'John Doe',
    createAt: '2024-01-15T10:30:00Z',
    details: 'Test job details',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardComponent, NoopAnimationsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardComponent);
    component = fixture.componentInstance;
    component.job = mockJob;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display job information correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('TEST-SKU-001');
    expect(compiled.querySelector('mat-card-subtitle')?.textContent).toContain('John Doe');
    expect(compiled.querySelector('.job-details-text')?.textContent).toContain('Test job details');
  });

  it('should return correct status color for different statuses', () => {
    expect(component.getStatusColor('completed')).toBe('primary');
    expect(component.getStatusColor('pending')).toBe('warn');
    expect(component.getStatusColor('inProgress')).toBe('accent');
  });

  it('should return correct status icon for different statuses', () => {
    expect(component.getStatusIcon('completed')).toBe('check_circle');
    expect(component.getStatusIcon('pending')).toBe('schedule');
    expect(component.getStatusIcon('inProgress')).toBe('hourglass_empty');
  });
});
