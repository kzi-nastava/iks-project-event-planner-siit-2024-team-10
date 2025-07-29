export interface Provider {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string | null; // Optional since `null` is a possible value
  phoneNumber: string;
  accountId: number;
  
  // Personal Address
  location: {
    id: number;
    city: string;
    country: string;
    street: string;
    houseNumber: string;
  };

  // Company Details
  company: {
    name: string;
    description: string;
    email: string;
    phoneNumber: string;
    location: {
      city: string;
      country: string;
      street: string;
      houseNumber: string;
    };
    photos: string[]; // Array of photos
  };
}
