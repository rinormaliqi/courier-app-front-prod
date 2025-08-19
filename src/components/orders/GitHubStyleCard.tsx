// src/components/orders/GitHubStyleCard.tsx
"use client";
import {
  FaEllipsisH,
  FaPaperclip,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { STATUS_CONFIG } from "./StatusConfig";
import { StatusKey } from "./StatusConfig";
import { useEffect, useState } from "react";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface Order {
  id: number;
  description: string;
  orderStatus: StatusKey;
  createdAt: string;
  doctor?: {
    locationDTO: {
      formattedAddress: string;
      city: string;
      postalCode: string;
    };
    lastName?: string;
    address?: string;
  };
  courier?: {
    firstName?: string;
    lastName?: string;
  };
}

interface GitHubStyleCardProps {
  order: Order;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: StatusKey) => void;
  statuses: StatusKey[];
  isSelected: boolean;
  onToggleSelect: () => void;
  assignMode: boolean;
}

// const getStatusClass = (status: StatusKey) => {
//   return STATUS_CONFIG[status].color.replace("bg-", "");
// };

export const GitHubStyleCard = ({
  order,
  onDelete,
  onStatusChange,
  statuses,
  isSelected,
  onToggleSelect,
  assignMode,
}: GitHubStyleCardProps) => {
  const statusClass = STATUS_CONFIG[order.orderStatus].color;
  const [showOptions, setShowOptions] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("date.today");
    if (diffDays === 1) return t("date.one_day_ago");
    return t("date.days_ago");
  };
  const { t } = useLanguage(); // Add this hook

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-wrapper")) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`bg-white p-4 rounded-lg border mb-3 transition-colors
        ${isSelected ? "ring-2 ring-green-500" : "border-gray-200"}
        ${assignMode ? "cursor-pointer hover:bg-blue-50" : "cursor-grab hover:bg-gray-50"}`}
      draggable={!assignMode}
      onDragStart={(e) =>
        !assignMode && e.dataTransfer.setData("text/plain", order.id.toString())
      }
      onClick={() => assignMode && onToggleSelect()}
    >
      {assignMode && (
        <div className="flex justify-end mb-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
          />
        </div>
      )}

      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${statusClass}`}
          ></span>
          <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
            #{order.id}: {order.description}
          </h3>
        </div>

        <div className="relative dropdown-wrapper">
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions((prev) => !prev);
            }}
          >
            <FaEllipsisH />
          </button>

          <div
            className={`absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10 transition-all duration-150 ease-in
              ${showOptions ? "opacity-100 scale-100" : "opacity-0 scale-95 invisible"}`}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(order.id);
              }}
            >
              {t("order.delete_order")}
            </button>
            <div className="px-3 py-2 text-xs text-gray-500 border-t">
              {t("order.change_status")}:
              <div className="flex flex-wrap gap-1 mt-1">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className="px-2.5 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(order.id, status);
                    }}
                  >
                    {STATUS_CONFIG[status].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-3 ml-1 text-xs text-gray-500">
        <div className="flex items-center">
          <FaPaperclip className="mr-1.5 text-gray-400" size={12} />
          <span>2</span>
        </div>
        <div className="bg-gray-100 px-2 py-0.5 rounded-full">
          {formatDate(order.createdAt)}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {t("order.priority_tag")}
        </span>
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          {t("order.medical_tag")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center">
          {order.courier ? (
            <div className="flex items-center">
              <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                <FaUser className="text-gray-600 text-xs" />
              </div>
              <span className="text-xs text-gray-700 truncate">
                {order.courier.firstName} {order.courier.lastName}
              </span>
            </div>
          ) : (
            <div className="text-xs text-gray-500 px-2 py-1 border border-dashed border-gray-300 rounded">
              {t("order.unassigned")}
            </div>
          )}
        </div>

        <div className="flex flex-col text-right">
          <div className="text-xs font-medium truncate">
            {t("order.doctor_prefix")}{" "}
            {order.doctor?.lastName || t("order.unknown")}
          </div>
          <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
            <FaMapMarkerAlt className="mr-1 text-gray-400" size={10} />
            <span className="truncate max-w-[120px]">
              {order.doctor?.locationDTO?.city || t("order.no_address")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
