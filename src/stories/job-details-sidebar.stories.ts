import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JobDetailsSidebarComponent } from '../app/features/dashboard/components/job-details-sidebar/job-details-sidebar.component';
import { MaterialModule } from '../app/shared/material.module';
import { CommonModule } from '@angular/common';
import { Job } from '../app/features/dashboard/models/dashboard.model';
import { DashboardService } from '../app/features/dashboard/services/dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

// Mock DashboardService for Storybook
class MockDashboardService {
  deleteJob() {
    return of(null);
  }

  updateJobStatus(id: string, status: string) {
    return of({ id, status, sku: 'MOCK-SKU', assignedUser: 'Mock User', createAt: new Date().toISOString(), details: 'Mock job details' });
  }
}

const meta: Meta<JobDetailsSidebarComponent> = {
  title: 'Dashboard/JobDetailsSidebar',
  component: JobDetailsSidebarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MaterialModule, HttpClientTestingModule],
      providers: [
        { provide: DashboardService, useClass: MockDashboardService },
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        height: '600px',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls if the sidebar is open or closed',
    },
    selectedJob: {
      control: 'object',
      description: 'The job object to display details for',
    },
    closeSidebar: {
      action: 'closeSidebar',
      description: 'Event emitted when sidebar should be closed',
    },
  },
};

export default meta;
type Story = StoryObj<JobDetailsSidebarComponent>;

// Mock job data
const mockJob: Job = {
  id: '1',
  sku: 'WH-001-SKU',
  status: 'pending',
  assignedUser: 'John Doe',
  createAt: '2024-01-15T10:30:00Z',
  details: 'Pick and pack order for customer ABC. Handle with care as items are fragile. This is a detailed description of the job that needs to be completed.',
};

const mockJobInProgress: Job = {
  id: '2',
  sku: 'WH-002-SKU',
  status: 'inProgress',
  assignedUser: 'Jane Smith',
  createAt: '2024-01-16T14:20:00Z',
  details: 'Quality check and inventory management for warehouse section B. Ensure all items are properly labeled and sorted according to the new classification system.',
};

const mockJobCompleted: Job = {
  id: '3',
  sku: 'WH-003-SKU',
  status: 'completed',
  assignedUser: 'Mike Johnson',
  createAt: '2024-01-14T09:15:00Z',
  details: 'Successfully completed inventory audit for Q1. All discrepancies have been resolved and documentation has been updated in the system.',
};

export const Closed: Story = {
  args: {
    isOpen: false,
    selectedJob: mockJob,
  },
};

export const OpenWithPendingJob: Story = {
  args: {
    isOpen: true,
    selectedJob: mockJob,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar opened with a pending job showing all job details and actions.',
      },
    },
  },
};

export const OpenWithInProgressJob: Story = {
  args: {
    isOpen: true,
    selectedJob: mockJobInProgress,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar opened with an in-progress job, showing different status colors and icons.',
      },
    },
  },
};

export const OpenWithCompletedJob: Story = {
  args: {
    isOpen: true,
    selectedJob: mockJobCompleted,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar opened with a completed job, showing success status styling.',
      },
    },
  },
};

export const OpenWithLongDetails: Story = {
  args: {
    isOpen: true,
    selectedJob: {
      ...mockJob,
      id: '4',
      sku: 'WH-004-LONG-SKU',
      details: 'This is a very long job description that demonstrates how the sidebar handles extensive text content. The job involves multiple steps including initial assessment, quality control, inventory management, documentation updates, system synchronization, team coordination, and final verification. Each step requires careful attention to detail and proper documentation to ensure compliance with warehouse standards and procedures.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar with a job that has very long details to test text overflow and scrolling behavior.',
      },
    },
  },
};

export const OpenWithNoJob: Story = {
  args: {
    isOpen: true,
    selectedJob: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sidebar opened but no job selected - should show empty state.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    isOpen: true,
    selectedJob: mockJob,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing the sidebar functionality. Click the close button or overlay to close the sidebar.',
      },
    },
  },
  play: async ({ canvasElement: _canvasElement }) => {
    // This story is for interactive testing
    // Users can interact with the close button and overlay
    // canvasElement parameter is available but not used in this story
  },
};
