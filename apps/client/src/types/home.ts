// TODO: replace with API response types when /home endpoint exists
export type PetStatus = 'ACTIVE' | 'EXPIRES' | 'PENDING' | 'EXPIRED';
export type NotificationType = 'action' | 'reminder' | 'success' | 'info';

export interface HomePet {
  id: string;
  name: string;
  species: string;
  breed: string;
  status: PetStatus;
  statusLabel: string;
}

export interface HomeNotification {
  id: string;
  type: NotificationType;
  title: string;
  subtitle: string;
  route: string;
}
