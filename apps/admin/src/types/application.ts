export type AppType = 'New' | 'Renewal' | 'Transfer';
export type AppStatus = 'PENDING' | 'REVIEW' | 'APPROVED' | 'REJECTED';

export interface Application {
  id: string;
  applicant: string;
  nic: string;
  phone: string;
  email: string;
  pet: string;
  species: string;
  breed: string;
  dob: string;
  microchip: string;
  type: AppType;
  district: string;
  submitted: string;
  status: AppStatus;
  notes: string;
}
