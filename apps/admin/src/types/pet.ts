export type PetStatus = 'ACTIVE' | 'EXPIRED' | 'INACTIVE';

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  dob: string;
  microchip: string;
  owner: string;
  ownerId: string;
  district: string;
  registered: string;
  licenceExpiry: string;
  status: PetStatus;
}
