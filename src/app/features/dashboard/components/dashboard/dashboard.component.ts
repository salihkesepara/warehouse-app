import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { DashboardService } from '../../services/dashboard.service';
import { Job, RecentActivity, Status } from '../../models/dashboard.model';
import { JobCardComponent } from '../job-card/job-card.component';
import { JobDetailsSidebarComponent } from '../job-details-sidebar/job-details-sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, JobCardComponent, JobDetailsSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  recentActivities: RecentActivity[] = [];
  loading = false;
  activitiesLoading = false;
  error: string | null = null;
  activitiesError: string | null = null;

  // Filter state
  selectedFilter: Status | 'all' = 'all';
  filterOptions: { value: Status | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Jobs', icon: 'list' },
    { value: 'pending', label: 'Pending', icon: 'schedule' },
    { value: 'inProgress', label: 'In Progress', icon: 'hourglass_empty' },
    { value: 'completed', label: 'Completed', icon: 'check_circle' },
  ];

  // Date filter state
  startDate: Date | null = null;
  endDate: Date | null = null;

  // Sidebar state
  sidebarOpen = false;
  selectedJob: Job | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadJobs();
    this.loadRecentActivities();
  }

  private loadJobs(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = this.sortJobsByDate(jobs);
        this.applyFilter();
        this.loading = false;
      },
      error: (_error) => {
        this.error = 'Failed to load jobs';
        this.loading = false;
      },
    });
  }

  private loadRecentActivities(): void {
    this.activitiesLoading = true;
    this.activitiesError = null;

    this.dashboardService.getRecentActivities().subscribe({
      next: (activities) => {
        this.recentActivities = activities;
        this.activitiesLoading = false;
      },
      error: (_error) => {
        this.activitiesError = 'Failed to load activities';
        this.activitiesLoading = false;
      },
    });
  }

  trackByJobId(index: number, job: Job): string {
    return job.id;
  }

  trackByActivityId(index: number, activity: RecentActivity): string {
    return activity.id;
  }

  handleJobDeleted(deletedJobId: string): void {
    this.jobs = this.jobs.filter(job => job.id !== deletedJobId);
    this.filteredJobs = this.filteredJobs.filter(job => job.id !== deletedJobId);
    this.sidebarOpen = false;
  }

  handleJobStatusUpdated(updatedJob: Job): void {
    // Update the job in the jobs array
    const jobIndex = this.jobs.findIndex(job => job.id === updatedJob.id);
    if (jobIndex !== -1) {
      this.jobs[jobIndex] = updatedJob;
    }

    // Re-apply filter to show updated jobs
    this.applyFilter();

    // Refresh recent activities to reflect the status change
    this.loadRecentActivities();
  }

  // Filter methods
  onFilterChange(filterValue: Status | 'all'): void {
    this.selectedFilter = filterValue;
    this.applyFilter();
  }

  onDateRangeChange(startDate: Date | null, endDate: Date | null): void {
    this.startDate = startDate;
    this.endDate = endDate;
    this.applyFilter();
  }

  clearFilters(): void {
    this.selectedFilter = 'all';
    this.startDate = null;
    this.endDate = null;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredJobs = this.jobs.filter(job => {
      // Status filter
      const matchesStatus = this.selectedFilter === 'all' || job.status === this.selectedFilter;

      // Date filter
      let matchesDateRange = true;
      if (this.startDate || this.endDate) {
        const jobDate = new Date(job.createAt);
        const startOfDay = this.startDate ? new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()) : null;
        const endOfDay = this.endDate ? new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate(), 23, 59, 59) : null;

        matchesDateRange = (!startOfDay || jobDate >= startOfDay) && (!endOfDay || jobDate <= endOfDay);
      }

      return matchesStatus && matchesDateRange;
    });
  }

  getFilteredJobsCount(): number {
    return this.filteredJobs.length;
  }

  getActivityIcon(type: string): string {
    switch (type.toLowerCase()) {
      case 'job_created':
        return 'add_circle';
      case 'job_started':
        return 'start';
      case 'job_completed':
        return 'check_circle';
      case 'warehouse_created':
        return 'warehouse';
      case 'warehouse_updated':
        return 'edit_location';
      default:
        return 'info';
    }
  }

  getActivityColor(type: string): string {
    switch (type.toLowerCase()) {
      case 'job_created':
        return 'accent';
      case 'job_completed':
        return 'primary';
      case 'warehouse_created':
        return 'primary';
      case 'warehouse_updated':
        return 'warn';
      default:
        return '';
    }
  }

  getPendingJobsCount(): number {
    return this.jobs.filter(job => {
      return job.status === 'pending';
    }).length;
  }

  getInProgressJobsCount(): number {
    return this.jobs.filter(job => {
      return job.status === 'inProgress';
    }).length;
  }

  getCompletedJobsCount(): number {
    return this.jobs.filter(job => {
      return job.status === 'completed';
    }).length;
  }

  onViewJobDetails(job: Job): void {
    this.selectedJob = job;
    this.sidebarOpen = true;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
    setTimeout(() => {
      this.selectedJob = null;
    }, 300); // Wait for animation to complete
  }

  private sortJobsByDate(jobs: Job[]): Job[] {
    return jobs.sort((a, b) => {
      const dateA = new Date(a.createAt).getTime();
      const dateB = new Date(b.createAt).getTime();
      return dateB - dateA; // Descending order (newest first)
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return 'primary';
      case 'Pending':
        return 'warn';
      case 'In Progress':
        return 'accent';

      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Completed':
        return 'check_circle';
      case 'Pending':
        return 'schedule';
      case 'In Progress':
        return 'hourglass_empty';

      default:
        return 'info';
    }
  }
}
