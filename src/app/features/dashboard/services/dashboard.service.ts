import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Job, RecentActivity, ActivityType, Status } from '../models/dashboard.model';

/**
 * Dashboard service for managing jobs and activities data.
 * Provides HTTP operations for CRUD operations on jobs and generates recent activities.
 */
@Injectable({
  providedIn: 'root',
})

export class DashboardService {
  /** Base API URL for all HTTP requests */
  private readonly apiUrl = 'http://localhost:3000';

  /**
   * Creates an instance of DashboardService.
   * @param http - Angular HttpClient for making HTTP requests
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves all jobs from the backend API.
   * @returns Observable<Job[]> - An observable containing an array of all jobs
   * @example
   * ```typescript
   * this.dashboardService.getJobs().subscribe(jobs => {
   *   console.log('Loaded jobs:', jobs);
   * });
   * ```
   */
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  /**
   * Generates and retrieves recent activities based on job data.
   * Creates activity entries for job creation, completion, and progress updates.
   * @returns Observable<RecentActivity[]> - An observable containing recent activities (max 10 items)
   * @example
   * ```typescript
   * this.dashboardService.getRecentActivities().subscribe(activities => {
   *   console.log('Recent activities:', activities);
   * });
   * ```
   */
  getRecentActivities(): Observable<RecentActivity[]> {
    return this.getJobs().pipe(
      map(jobs => {
        return this.generateActivitiesFromJobs(jobs);
      }),
    );
  }

  /**
   * Deletes a specific job from the backend.
   * @param id - Unique identifier of the job to delete
   * @returns Observable<void> - An observable that completes when the job is deleted
   * @throws HTTP error if the job doesn't exist or deletion fails
   * @example
   * ```typescript
   * this.dashboardService.deleteJob('job-123').subscribe({
   *   next: () => console.log('Job deleted successfully'),
   *   error: (error) => console.error('Failed to delete job:', error)
   * });
   * ```
   */
  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${id}`);
  }

  /**
   * Updates the status of a specific job.
   * @param id - Unique identifier of the job to update
   * @param status - New status to assign to the job ('pending' | 'inProgress' | 'completed')
   * @returns Observable<Job> - An observable containing the updated job object
   * @throws HTTP error if the job doesn't exist or update fails
   * @example
   * ```typescript
   * this.dashboardService.updateJobStatus('job-123', 'completed').subscribe({
   *   next: (updatedJob) => console.log('Job updated:', updatedJob),
   *   error: (error) => console.error('Failed to update job:', error)
   * });
   * ```
   */
  updateJobStatus(id: string, status: Status): Observable<Job> {
    return this.http.patch<Job>(`${this.apiUrl}/jobs/${id}`, { status });
  }

  /**
   * Generates mock recent activities from job data.
   * Creates activity entries based on job status and creation dates.
   *
   * @private
   * @param jobs - Array of jobs to generate activities from
   * @returns RecentActivity[] - Array of generated activities, sorted by timestamp (max 10 items)
   *
   * @description
   * This method processes the most recent 3 jobs and creates activities for:
   * - Job creation (for all jobs)
   * - Job completion (for completed jobs with simulated completion time)
   * - Job progress (for in-progress jobs with simulated start time)
   *
   * The activities are sorted by timestamp in descending order and limited to 10 items.
   */
  private generateActivitiesFromJobs(jobs: Job[]): RecentActivity[] {
    const activities: RecentActivity[] = [];

    // Sort jobs by creation date (newest first)
    const sortedJobs = jobs.sort((a, b) =>
      new Date(b.createAt).getTime() - new Date(a.createAt).getTime(),
    );

    // Take only the 3 most recent jobs to generate activities
    const recentJobs = sortedJobs.slice(0, 3);

    recentJobs.forEach((job, index) => {
      const createDate = new Date(job.createAt);
      const status: Status = job.status;

      // Always add job creation activity
      activities.push({
        id: `activity-created-${job.id}-${index}`,
        type: ActivityType.JOB_CREATED,
        description: `Job created: ${job.sku} assigned to ${job.assignedUser}`,
        timestamp: createDate,
        jobId: job.id,
      });

      // Add completion activity for completed jobs
      if (status === 'completed') {
        const completedDate = new Date(createDate.getTime() + (Math.random() * 24 * 60 * 60 * 1000));
        activities.push({
          id: `activity-completed-${job.id}-${index}`,
          type: ActivityType.JOB_COMPLETED,
          description: `Job completed: ${job.sku} by ${job.assignedUser}`,
          timestamp: completedDate,
          jobId: job.id,
        });
      } else if (status === 'inProgress') {
        // Add progress activity for in-progress jobs
        const progressDate = new Date(createDate.getTime() + (Math.random() * 12 * 60 * 60 * 1000));
        activities.push({
          id: `activity-progress-${job.id}-${index}`,
          type: ActivityType.JOB_CREATED,
          description: `Job started: ${job.sku} being worked on by ${job.assignedUser}`,
          timestamp: progressDate,
          jobId: job.id,
        });
      }
    });

    // Sort activities by timestamp (newest first) and limit to 10 items
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
  }
}
