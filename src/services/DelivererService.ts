import axios from "axios";

export interface Deliverer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v3/users/deliverers`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const DelivererService = {
  async getAllDeliverers(): Promise<Deliverer[]> {
    const { data } = await axiosInstance.get("");
    return data;
  },
};
