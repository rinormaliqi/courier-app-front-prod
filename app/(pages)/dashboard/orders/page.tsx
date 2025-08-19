"use client";
import { useState, useEffect, useMemo } from "react";
import { useOrders } from "@/src/hooks/useOrders";
import { OrderFormModal } from "@/src/components/orders/OrderFormModal";
import { StatusColumn } from "@/src/components/orders/StatusColumn";
import { StatusKey } from "@/src/components/orders/StatusConfig";
import {
  FaBoxOpen,
  FaSearch,
  FaPlus,
  FaCog,
  FaRandom,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { OrderStatusService } from "@/src/services/orderStatusService";
import {
  FeaturesModal,
  FeatureAction,
} from "@/src/components/orders/FeaturesModal";
import {
  NotificationProvider,
  useNotification,
} from "@/src/components/Notification/Notification";

const OrdersPageWithNotifications = () => {
  return (
    <NotificationProvider>
      <OrdersPage />
    </NotificationProvider>
  );
};

const OrdersPage = () => {
  const { t } = useLanguage();
  const {
    orders,
    loading,
    error,
    createOrder,
    deleteOrder,
    updateStatus,
    refreshOrders,
    setSize,
  } = useOrders();

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeToggle, setActiveToggle] = useState<"PICKUP" | "DROPOFF">(
    "PICKUP",
  );
  const { showNotification } = useNotification();
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showAssignConfirmation, setShowAssignConfirmation] = useState(false);

  const statuses: StatusKey[] = [
    "NEW_ORDER",
    "ASSIGN_TO_PICK_UP",
    "ASSIGN_TO_DROP_OFF",
    "IN_PROGRESS",
    "READY_TO_DELIVER",
    "COMPLETED_PICK_UP",
    "COMPLETED_DROP_OFF",
    "DONE",
    "CANCELED",
  ];

  const statusGroups = {
    PICKUP: ["ASSIGN_TO_PICK_UP", "COMPLETED_PICK_UP", "IN_PROGRESS"],
    DROPOFF: ["READY_TO_DELIVER", "ASSIGN_TO_DROP_OFF", "COMPLETED_DROP_OFF"],
  };

  const handleFeatureAction = async (action: FeatureAction) => {
    try {
      switch (action) {
        case "makeAllNew":
          await OrderStatusService.makeAllOrdersNew();
          alert(t("all_orders_made_new"));
          break;
        case "generateReport":
          alert(t("report_generated"));
          break;
        case "clearAll":
          await OrderStatusService.makeAllOrdersNew();
          alert(t("all_orders_cleared"));
          refreshOrders();
          break;
      }
      refreshOrders();
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(t("operation_failed"));
    }
  };

  useEffect(() => {
    setSize(100);
  }, [setSize]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationPermission("granted");
          setUserLocation({ lat: latitude, lng: longitude });
          // Note: You might want to uncomment this if you have the sendLocationToBackend function
          // sendLocationToBackend(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationPermission("denied");
        },
        { enableHighAccuracy: true, timeout: 5000 },
      );
    }
  }, []);

  const filteredOrderIds = useMemo(() => {
    const ids = new Set<number>();
    orders.forEach((order) => {
      if (
        [
          order.description,
          order.doctor?.address,
          order.doctor?.firstName,
          order.doctor?.lastName,
        ].some((val) => val?.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        ids.add(order.id);
      }
    });
    return ids;
  }, [orders, searchTerm]);

  const showSuccess = (message: string) => showNotification(message, "success");
  const showError = (message: string) => showNotification(message, "error");

  const handleStatusChange = async (orderId: number, newStatus: StatusKey) => {
    try {
      await updateStatus(orderId, newStatus);
      showSuccess(t("order_status_updated"));
    } catch (error) {
      showError(t("order_status_update_failed"));
      console.log(error)
    }
  };

  const handleAssignAllRandomly = async () => {
    try {
      await OrderStatusService.assignAllOrdersRandomly();
      showSuccess(t("all_orders_assigned_randomly"));
      refreshOrders();
      setShowAssignConfirmation(false);
    } catch (error) {
      console.error("Random assignment failed:", error);
      showError(t("assignment_failed"));
    }
  };

  if (loading && orders.length === 0)
    return <div className="text-center p-10">{t("loading_orders")}</div>;
  if (error)
    return (
      <div className="text-red-500 p-4">
        {t("error")}: {error}
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#00b294]">
            <FaBoxOpen className="text-[#00b294]" /> {t("delivery_board")}
          </h1>
          {locationPermission === "granted" && (
            <p className="text-xs text-green-600 mt-1">
              {t("location_sharing_enabled")}
            </p>
          )}

          <div className="flex mt-2">
            <button
              className={`px-4 py-2 rounded-l-lg ${activeToggle === "PICKUP" ? "bg-[#00b294] text-white" : "bg-gray-200"}`}
              onClick={() => setActiveToggle("PICKUP")}
            >
              {t("pickup_toggle")}
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${activeToggle === "DROPOFF" ? "bg-[#00b294] text-white" : "bg-gray-200"}`}
              onClick={() => setActiveToggle("DROPOFF")}
            >
              {t("dropoff_toggle")}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 border-[#00b294]">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              placeholder={t("search_orders_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              className="bg-[#00b294] hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => setShowAssignConfirmation(true)}
            >
              <FaRandom /> {t("assign_orders")}
            </button>

            <button
              className="bg-[#00b294] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => setShowModal(true)}
            >
              <FaPlus /> {t("add_order")}
            </button>

            <button
              className="bg-[#00b294] hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => setShowFeaturesModal(true)}
            >
              <FaCog /> {t("features")}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {t("updating")}...
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-gray-500 text-center py-10 border rounded-lg bg-white">
          {t("no_orders_found")}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 w-full">
          {statusGroups[activeToggle].map((status) => (
            <StatusColumn
              key={status}
              status={status as StatusKey}
              toggleType={activeToggle}
              orders={orders}
              filteredOrderIds={filteredOrderIds}
              onDelete={deleteOrder}
              onStatusChange={handleStatusChange}
              statuses={statuses}
              assignMode={false}
              selectedOrders={[]}
              onToggleSelect={() => {}}
            />
          ))}
        </div>
      )}

      {showModal && (
        <OrderFormModal
          onClose={() => setShowModal(false)}
          onSubmit={async (formData) => {
            await createOrder(formData);
          }}
        />
      )}

      {showFeaturesModal && (
        <FeaturesModal
          onClose={() => setShowFeaturesModal(false)}
          onActionConfirmed={handleFeatureAction}
        />
      )}

      {/* Random Assignment Confirmation Modal */}
      {showAssignConfirmation && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAssignConfirmation(false)}
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              <h2 className="text-xl font-bold">{t("confirm_action")}</h2>
            </div>

            <p className="mb-6 text-gray-600">{t("confirm_assign_randomly")}</p>

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowAssignConfirmation(false)}
              >
                {t("cancel")}
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleAssignAllRandomly}
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPageWithNotifications;
