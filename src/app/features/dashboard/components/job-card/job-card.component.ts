import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material.module';
import { Job, Status } from '../../models/dashboard.model';

/**
 * Job Card Component for displaying individual job information in a card format.
 * Provides visual representation of job status, details, and user interaction capabilities.
 *
 * @component
 * @selector app-job-card
 * @standalone
 */
@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css',
})
export class JobCardComponent {
  /**
   * Job data to be displayed in the card.
   * Required input property containing all job information.
   */
  @Input() job!: Job;

  /**
   * Event emitter for when user wants to view job details.
   * Emits the complete job object to parent component.
   */
  @Output() viewDetails = new EventEmitter<Job>();

  /**
   * Returns the appropriate Angular Material color theme for a given job status.
   * Used for styling status chips and indicators with consistent color coding.
   *
   * @param status - The job status to get color for
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
    switch (status) {
      case 'completed':
        return 'primary';
      case 'pending':
        return 'warn';
      case 'inProgress':
        return 'accent';
      default:
        return '';
    }
  }

  /**
   * Returns the appropriate Material Design icon name for a given job status.
   * Provides visual representation of job state using recognizable icons.
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
    switch (status) {
      case 'completed':
        return 'check_circle';
      case 'pending':
        return 'schedule';
      case 'inProgress':
        return 'hourglass_empty';

      default:
        return 'info';
    }
  }

  /**
   * Returns the appropriate CSS class name for styling based on job status.
   * Used for applying status-specific styling to card elements.
   *
   * @param status - The job status to get CSS class for
   * @returns CSS class name string
   *
   * @example
   * ```typescript
   * const cssClass = this.getStatusClass('inProgress'); // returns 'in-progress'
   * ```
   *
   * @description
   * CSS class mapping:
   * - 'completed' → 'completed' (green styling)
   * - 'pending' → 'pending' (orange styling)
   * - 'inProgress' → 'in-progress' (purple styling)
   * - default → '' (no specific styling)
   */
  getStatusClass(status: Status): string {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'inProgress':
        return 'in-progress';

      default:
        return '';
    }
  }

  /**
   * Handles the view details button click event.
   * Emits the current job object to parent component for detailed view.
   *
   * @returns void
   *
   * @example
   * ```html
   * <button (click)="onViewDetails()">View Details</button>
   * ```
   *
   * @description
   * This method is typically called when user clicks on "View Details" button
   * or the card itself. It emits the complete job object through the viewDetails
   * EventEmitter, allowing parent components to open detailed job information
   * in a sidebar, modal, or separate view.
   */
  onViewDetails(): void {
    this.viewDetails.emit(this.job);
  }
}
