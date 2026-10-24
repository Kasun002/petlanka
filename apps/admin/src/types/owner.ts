export interface Owner {
  id: string;
  name: string;
  nic: string;
  phone: string;
  email: string;
  district: string;
  petCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}
