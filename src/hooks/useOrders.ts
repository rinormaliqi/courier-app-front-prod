// src/hooks/useOrders.ts
import { useEffect, useState } from "react";
import { Order, OrderFormData } from "@/src/types/models";
import { OrderService } from "@/src/services/orderService";
import { OrderStatusService } from "@/src/services/orderStatusService";
import { StatusKey } from "@/src/components/orders/StatusConfig";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);
  const [needsRefresh, setNeedsRefresh] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OrderService.getAllPaginated(page, size);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
      setNeedsRefresh(false);
    }
  };

  useEffect(() => {
    if (needsRefresh) {
      fetchOrders();
    }
  }, [page, size, needsRefresh]);

  const createOrder = async (order: OrderFormData) => {
    try {
      setLoading(true);
      const newOrder = await OrderService.create(order);
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to create order.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      setLoading(true);
      await OrderService.delete(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to delete order.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: StatusKey) => {
    try {
      setLoading(true);
      // Optimistic update
      setOrders(
        (prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, orderStatus: status } : order,
          ) as Order[],
      );

      // Actual API call
      await OrderStatusService.updateStatus(id, status);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to update status.");
      // Revert on error
      setNeedsRefresh(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = () => {
    setNeedsRefresh(true);
  };

  return {
    orders,
    loading,
    error,
    page,
    setPage,
    size,
    setSize,
    totalPages,
    createOrder,
    deleteOrder,
    updateStatus,
    refreshOrders,
  };
};
