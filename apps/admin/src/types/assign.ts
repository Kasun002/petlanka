export type Priority = 'HIGH' | 'NORMAL';
export type AssignStatus = 'PENDING' | 'ASSIGNED' | 'COMPLETE';

export interface AssignRequest {
  id: string;
  applicationId: string;
  applicant: string;
  type: string;
  district: string;
  submitted: string;
  priority: Priority;
  assignedTo: string | null;
  status: AssignStatus;
}

export interface Officer {
  id: string;
  name: string;
  district: string;
  activeCount: number;
}
