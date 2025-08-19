export interface LocationDTO {
  id?: number;
  latitude: number;
  longitude: number;
  formattedAddress: string;
  city: string;
  postalCode: string;
}

export interface Doctor {
  id: number;
  createdAt: string;
  createdBy: number;
  updatedAt: string;
  updatedBy: number;
  deletedAt: string | null;
  deletedBy: number | null;
  firstName: string;
  lastName: string;
  address: string;
  locationDTO: LocationDTO;
}

// For form handling (create/update)
export type DoctorFormData = Omit<
  Doctor,
  "id" | "createdAt" | "createdBy" | "updatedAt" | "updatedBy"
>;
