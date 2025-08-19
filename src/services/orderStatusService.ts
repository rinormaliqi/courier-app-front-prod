// src/services/orderStatusService.ts
import axios from "axios";
import { Order } from "@/src/types/models";
import { StatusKey } from "@/src/components/orders/StatusConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const OrderStatusService = {
  async updateStatus(orderId: number, status: StatusKey): Promise<Order> {
    const endpointMap: Record<StatusKey, string> = {
      NEW_ORDER: `/api/v3/orders/${orderId}/update/status`,
      ASSIGN_TO_PICK_UP: `/api/v3/orders/${orderId}/update/status`,
      ASSIGN_TO_DROP_OFF: `/api/v3/orders/${orderId}/update/status`,
      COMPLETED_PICK_UP: `/api/v3/orders/${orderId}/update/complete-pick-up`,
      COMPLETED_DROP_OFF: `/api/v3/orders/${orderId}/update/complete-drop-off`,
      IN_PROGRESS: `/api/v3/orders/${orderId}/update/in-progress`,
      READY_TO_DELIVER: `/api/v3/orders/${orderId}/update/ready-to-deliver`,
      DONE: `/api/v3/orders/${orderId}/update/done`,
      CANCELED: `/api/v3/orders/${orderId}/update/canceled`,
    };

    const endpoint = endpointMap[status];

    try {
      if (
        status === "NEW_ORDER" ||
        status === "ASSIGN_TO_PICK_UP" ||
        status === "ASSIGN_TO_DROP_OFF"
      ) {
        const response = await axiosInstance.patch(endpoint, status, {
          headers: { "Content-Type": "text/plain" },
        });
        return response.data;
      }

      const response = await axiosInstance.patch(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Failed to update status: ${(error as any).message}`);
    }
  },

  async makeAllOrdersNew(): Promise<void> {
    await axiosInstance.post("/api/v3/orders/make-all-orders-new");
  },

  async assignAllOrders(): Promise<void> {
    await axiosInstance.post("/api/v3/deliveries/assign-orders2");
  },

  async assignOrdersToUsers(
    userIds: number[],
    orderIds: number[],
  ): Promise<void> {
    await axiosInstance.post("/api/v3/deliveries/assign-orders-to-users", {
      userIds,
      orderIds,
    });
  },

  async assignOrdersToUser(
    courierId: number[],
    orderIds: number[],
  ): Promise<void> {
    try {
      const response = await axiosInstance.post(
        "/api/v3/deliveries/assign-orders-to-user",
        { courierId, ordersId: orderIds },
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async assignAllOrdersRandomly(): Promise<void> {
    await axiosInstance.post("/api/v3/deliveries/assign-orders2");
  },

  async getOrderById(orderId: number): Promise<Order> {
    return axiosInstance
      .get(`/api/v3/orders/${orderId}`)
      .then((res) => res.data);
  },

  async getOrdersByStatus(
    status: string,
    page: number = 0,
    size: number = 10,
  ): Promise<Order[]> {
    return axiosInstance
      .get(`/api/v3/orders/page/${status}`, {
        params: { page, size },
      })
      .then((res) => res.data.content);
  },

  async getPendingOrders(
    page: number = 0,
    size: number = 10,
  ): Promise<Order[]> {
    return axiosInstance
      .get("/api/v3/orders/page/pending-orders", {
        params: { page, size },
      })
      .then((res) => res.data.content);
  },

  async getDoneOrders(page: number = 0, size: number = 10): Promise<Order[]> {
    return axiosInstance
      .get("/api/v3/orders/page/done", {
        params: { page, size },
      })
      .then((res) => res.data.content);
  },
};
