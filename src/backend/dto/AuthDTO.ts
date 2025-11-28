import { Role } from '@prisma/client';

// DTO Login
export interface LoginDTO {
  email: string;
  password: string;
}

// DTO Register
export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  preferredLatitude: number | null;
  preferredLongitude: number | null;
  preferredAddress: string | null;
}


// DTO Auth Response
export interface AuthResponseDTO {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
    role: Role;
    preferredLatitude: number | null;
    preferredLongitude: number | null;
    preferredAddress: string | null;
  };
  token: string;
}