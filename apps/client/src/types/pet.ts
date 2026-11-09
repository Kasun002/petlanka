export type PetStatus = 'ACTIVE' | 'EXPIRES' | 'PENDING' | 'EXPIRED';
export type PetSpecies = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Other';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  dob: string;
  microchip?: string;
  status: PetStatus;
  statusLabel: string;
  licenceNumber?: string;
  licenceExpiresAt?: string;
  applicationId?: string;
}
