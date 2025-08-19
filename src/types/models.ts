import { StatusKey } from "@/src/components/orders/StatusConfig";
export interface User {
  id: string;
  name: string;
  role: "admin" | "manager" | "courier";
}
export interface Route {
  courierId: string;
  optimizedPath: string[];
  distance: number;
}

export interface User {
  id: string;
  name: string;
  role: "admin" | "manager" | "courier";
}
export interface Route {
  courierId: string;
  optimizedPath: string[];
  distance: number;
}

export interface LocationDTO {
  id: number;
  latitude: string;
  longitude: string;
  formattedAddress: string;
  city: string;
  postalCode: string;
}

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  locationDTO: LocationDTO;
}

export interface Courier {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export enum OrderStatus {
  NEW_ORDER = "NEW_ORDER",
  ASSIGN_TO_PICK_UP = "ASSIGN_TO_PICK_UP",
  ASSIGN_TO_DROP_OFF = "ASSIGN_TO_DROP_OFF",
  COMPLETED_PICK_UP = "COMPLETED_PICK_UP",
  COMPLETED_DROP_OFF = "COMPLETED_DROP_OFF",
  IN_PROGRESS = "IN_PROGRESS",
  READY_TO_DELIVER = "READY_TO_DELIVER",
  DONE = "DONE",
  CANCELED = "CANCELED",
}

export interface Order {
  id: number;

  description: string;
  doctor: Doctor;
  courier?: Courier;
  orderStatus: StatusKey;
  createdAt: string;
}

export interface OrdersResponse {
  totalElements: number;
  totalPages: number;
  content: Order[];
}

export type OrderFormData = {
  description: string;
  doctor_id: number;
  status:
    | "NEW_ORDER"
    | "ASSIGN_TO_PICK_UP"
    | "ASSIGN_TO_DROP_OFF"
    | "COMPLETED_PICK_UP"
    | "COMPLETED_DROP_OFF"
    | "IN_PROGRESS"
    | "READY_TO_DELIVER"
    | "DONE"
    | "CANCELED";
};
