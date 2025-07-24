import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { JobCardComponent } from '../app/features/dashboard/components/job-card/job-card.component';
import { MaterialModule } from '../app/shared/material.module';
import { CommonModule } from '@angular/common';

const meta: Meta<JobCardComponent> = {
  title: 'Dashboard/JobCard',
  component: JobCardComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MaterialModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    job: {
      control: 'object',
    },
    viewDetails: {
      action: 'viewDetails',
    },
  },
};

export default meta;
type Story = StoryObj<JobCardComponent>;

// Mock job data
const mockJob = {
  id: '1',
  sku: 'WH-001-SKU',
  status: 'pending',
  assignedUser: 'John Doe',
  createAt: '2024-01-15T10:30:00Z',
  details: 'Pick and pack order for customer ABC. Handle with care as items are fragile.',
};

export const Pending: Story = {
  args: {
    job: {
      ...mockJob,
      status: 'pending',
    },
  },
};

export const InProgress: Story = {
  args: {
    job: {
      ...mockJob,
      id: '2',
      sku: 'WH-002-SKU',
      status: 'inProgress',
      assignedUser: 'Jane Smith',
    },
  },
};

export const Completed: Story = {
  args: {
    job: {
      ...mockJob,
      id: '3',
      sku: 'WH-003-SKU',
      status: 'completed',
      assignedUser: 'Mike Johnson',
      details: 'Successfully completed inventory check for warehouse section A.',
    },
  },
};

export const LongDetails: Story = {
  args: {
    job: {
      ...mockJob,
      id: '4',
      sku: 'WH-004-SKU',
      status: 'inProgress',
      assignedUser: 'Alice Brown',
      details: 'This is a very long job description that demonstrates how the component handles overflow text. The text should be truncated with ellipsis when it exceeds the available space in the card layout.',
    },
  },
};

export const RecentJob: Story = {
  args: {
    job: {
      ...mockJob,
      id: '5',
      sku: 'WH-005-SKU',
      status: 'pending',
      assignedUser: 'Bob Wilson',
      createAt: new Date().toISOString(),
      details: 'Urgent delivery preparation for express shipping.',
    },
  },
};
