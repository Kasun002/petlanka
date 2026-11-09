export type ClientNotificationType = 'action' | 'reminder' | 'success' | 'info';

export interface ClientNotification {
  id: string;
  type: ClientNotificationType;
  title: string;
  body: string;
  route: string;
  read: boolean;
  time: string;
}
