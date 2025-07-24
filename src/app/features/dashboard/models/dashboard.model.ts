export interface DashboardStats {
  totalWarehouses: number;
  totalJobs: number;
  pendingJobs: number;
  completedJobs: number;
  totalCapacity: number;
  usedCapacity: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  warehouseId?: string;
  jobId?: string;
}

export enum ActivityType {
  JOB_CREATED = 'job_created',
  JOB_COMPLETED = 'job_completed',
  WAREHOUSE_CREATED = 'warehouse_created',
  WAREHOUSE_UPDATED = 'warehouse_updated'
}

export type Status = 'pending' | 'completed' | 'inProgress'

export interface Job {
  id: string;
  sku: string;
  status: Status;
  assignedUser: string;
  createAt: string;
  details: string;
}
