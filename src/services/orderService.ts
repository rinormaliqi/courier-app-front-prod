// src/services/orderService.ts
import axios from "axios";
import { Order, OrderFormData } from "@/src/types/models";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v3/orders`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const OrderService = {
  async getAllPaginated(
    page: number = 0,
    size: number = 200,
  ): Promise<{
    content: Order[];
    totalPages: number;
    totalElements: number;
  }> {
    const { data } = await axiosInstance.get("/page", {
      params: { page, size },
    });
    return data;
  },

  async getById(id: number): Promise<Order> {
    const { data } = await axiosInstance.get(`/${id}`);
    return data;
  },

  async create(order: OrderFormData): Promise<Order> {
    const { data } = await axiosInstance.post("/create", order);
    return data;
  },

  async update(id: number, order: OrderFormData): Promise<Order> {
    const payload = {
      id,
      description: order.description,
      doctor: { id: order.doctor_id },
      courier: null,
      orderStatus: order.status,
    };
    const { data } = await axiosInstance.put(`/${id}/update`, payload);
    return data;
  },

  async updateStatus(id: number, status: string): Promise<Order> {
    const { data } = await axiosInstance.put(`/${id}/update/status`, status, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/${id}/delete`);
  },
};
