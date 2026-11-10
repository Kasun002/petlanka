export interface UserProfile {
  fullName: string;
  nic: string;
  phone: string;
  email?: string;
  address: {
    province: string;
    district: string;
    city: string;
    streetAddress: string;
  };
}
