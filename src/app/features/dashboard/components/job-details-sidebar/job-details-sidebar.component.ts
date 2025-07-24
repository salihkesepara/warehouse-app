import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { Job, Status } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard.service';

/**
 * Job Details Sidebar Component for displaying and managing detailed job information.
 * Provides a slide-out sidebar interface for viewing, editing, and deleting jobs.
 * Supports job status updates and deletion with confirmation dialogs.
 *
 * @component
 * @selector app-job-details-sidebar
 * @standalone
 */
@Component({
  selector: 'app-job-details-sidebar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './job-details-sidebar.component.html',
  styleUrl: './job-details-sidebar.component.css',
})
export class JobDetailsSidebarComponent {
  /**
   * Controls the visibility state of the sidebar.
   * When true, sidebar slides in from the left.
   */
  @Input() isOpen = false;

  /**
   * The job object to display detailed information for.
   * When null, sidebar shows empty state.
   */
  @Input() selectedJob: Job | null = null;

  /**
   * Event emitter for closing the sidebar.
   * Triggered when user clicks close button or overlay.
   */
  @Output() closeSidebar = new EventEmitter<void>();

  /**
   * Event emitter for job deletion.
   * Emits the deleted job ID when deletion is successful.
   */
  @Output() jobDeleted = new EventEmitter<string>();

  /**
   * Event emitter for job status updates.
   * Emits the updated job object when status change is successful.
   */
  @Output() jobStatusUpdated = new EventEmitter<Job>();

  /** Dashboard service for backend operations */
  private dashboardService = inject(DashboardService);

  /**
   * Available status options for the status dropdown.
   * Defines all possible job statuses with display labels.
   */
  statusOptions: { value: Status; label: string }[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  /**
   * Handles the close sidebar button click event.
   * Emits closeSidebar event to notify parent component.
   *
   * @returns void
   *
   * @example
   * ```html
   * <button (click)="onCloseSidebar()">Close</button>
   * ```
   */
  onCloseSidebar(): void {
    this.closeSidebar.emit();
  }

  /**
   * Handles clicks on the sidebar overlay background.
   * Closes the sidebar when user clicks outside the sidebar content.
   *
   * @returns void
   *
   * @example
   * ```html
   * <div class="overlay" (click)="onOverlayClick()"></div>
   * ```
   */
  onOverlayClick(): void {
    this.closeSidebar.emit();
  }

  /**
   * Returns the appropriate Angular Material color theme for a given job status.
   * Used for styling status indicators and chips in the sidebar.
   *
   * @param status - The job status to get color theme for
   * @returns Material theme color string ('primary' | 'warn' | 'accent' | '')
   *
   * @example
   * ```typescript
   * const color = this.getStatusColor('completed'); // returns 'primary'
   * ```
   *
   * @description
   * Color mapping:
   * - 'completed' → 'primary' (blue/green theme)
   * - 'pending' → 'warn' (orange/amber theme)
   * - 'inProgress' → 'accent' (purple/pink theme)
   * - default → '' (no theme applied)
   */
  getStatusColor(status: Status): string {
    if (status === 'completed') {
      return 'primary';
    } else if (status === 'pending') {
      return 'warn';
    } else if (status === 'inProgress') {
      return 'accent';
    }
    return '';
  }

  /**
   * Returns the appropriate Material Design icon name for a given job status.
   * Provides consistent visual representation of job states in the sidebar.
   *
   * @param status - The job status to get icon for
   * @returns Material Design icon name string
   *
   * @example
   * ```typescript
   * const icon = this.getStatusIcon('pending'); // returns 'schedule'
   * ```
   *
   * @description
   * Icon mapping:
   * - 'completed' → 'check_circle' (checkmark in circle)
   * - 'pending' → 'schedule' (clock icon)
   * - 'inProgress' → 'hourglass_empty' (hourglass icon)
   * - default → 'info' (information icon)
   */
  getStatusIcon(status: Status): string {
    if (status === 'completed') {
      return 'check_circle';
    } else if (status === 'pending') {
      return 'schedule';
    } else if (status === 'inProgress') {
      return 'hourglass_empty';
    }
    return 'info';
  }

  /**
   * Handles job deletion with user confirmation.
   * Shows confirmation dialog and deletes job if confirmed.
   * Emits jobDeleted event and closes sidebar on success.
   *
   * @returns void
   *
   * @example
   * ```html
   * <button mat-raised-button color="warn" (click)="onDeleteJob()">
   *   Delete Job
   * </button>
   * ```
   *
   * @description
   * Process:
   * 1. Validates selectedJob exists
   * 2. Shows native confirmation dialog
   * 3. Calls dashboard service to delete job
   * 4. On success: emits jobDeleted with job ID and closes sidebar
   * 5. On error: shows error alert to user
   *
   * @throws Shows alert on deletion failure
   */
  onDeleteJob(): void {
    if (!this.selectedJob) {
      return;
    }

    const jobId = this.selectedJob.id;

    // Confirmation dialog could be added here
    if (confirm(`Are you sure you want to delete job ${this.selectedJob.sku}?`)) {
      this.dashboardService.deleteJob(jobId).subscribe({
        next: () => {
          this.jobDeleted.emit(jobId);
          this.closeSidebar.emit();
        },
        error: (_error) => {
          alert('Failed to delete job. Please try again.');
        },
      });
    }
  }

  /**
   * Handles job status updates from the status dropdown.
   * Updates job status via API and emits updated job to parent.
   *
   * @param newStatus - The new status to assign to the job
   * @returns void
   *
   * @example
   * ```html
   * <mat-select (selectionChange)="onStatusChange($event.value)">
   *   <mat-option value="pending">Pending</mat-option>
   * </mat-select>
   * ```
   *
   * @description
   * Process:
   * 1. Validates selectedJob exists and status is different
   * 2. Calls dashboard service to update job status
   * 3. On success: updates local job object and emits jobStatusUpdated
   * 4. On error: shows error alert to user
   *
   * @throws Shows alert on status update failure
   */
  onStatusChange(newStatus: Status): void {
    if (!this.selectedJob || newStatus === this.selectedJob.status) {
      return;
    }

    this.dashboardService.updateJobStatus(this.selectedJob.id, newStatus).subscribe({
      next: (updatedJob) => {
        // Update the local job object
        if (this.selectedJob) {
          this.selectedJob.status = updatedJob.status;
        }

        // Emit the updated job to parent component
        this.jobStatusUpdated.emit(updatedJob);
      },
      error: (_error) => {
        alert('Failed to update job status. Please try again.');
      },
    });
  }
}
