export type AppStatus = 'PENDING' | 'INFO_REQUIRED' | 'APPROVED' | 'REJECTED';

export interface OfficerNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface Application {
  id: string;
  petId: string;
  petName: string;
  petSpecies: string;
  status: AppStatus;
  submittedAt: string;
  updatedAt: string;
  officerNotes: OfficerNote[];
}
