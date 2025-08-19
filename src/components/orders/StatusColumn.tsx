// src/components/orders/StatusColumn.tsx
import { GitHubStyleCard } from "@/src/components/orders/GitHubStyleCard";
import { STATUS_CONFIG } from "./StatusConfig";
import { StatusKey } from "./StatusConfig";
import { Order } from "@/src/types/models";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { TOGGLE_LABELS } from "./StatusConfig";

interface StatusColumnProps {
  status: StatusKey;
  orders: Order[];
  filteredOrderIds: Set<number>;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: StatusKey) => void;
  statuses: StatusKey[];
  assignMode: boolean;
  selectedOrders: number[];
  onToggleSelect: (id: number) => void;
  toggleType: "PICKUP" | "DROPOFF"; // Add toggleType prop
}

export const StatusColumn = ({
  status,
  orders,
  filteredOrderIds,
  onDelete,
  onStatusChange,
  statuses,
  assignMode,
  selectedOrders,
  onToggleSelect,
  toggleType,
}: StatusColumnProps) => {
  const columnOrders = orders.filter(
    (order) => order.orderStatus === status && filteredOrderIds.has(order.id),
  );
  const { t } = useLanguage();

  const customLabelKey = TOGGLE_LABELS[toggleType][status];
  const customLabel = customLabelKey
    ? t(customLabelKey)
    : t(STATUS_CONFIG[status].label);

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-300">
      {" "}
      {/* Changed to flex-1 */}{" "}
      <div
        className={`p-3 rounded-t-lg flex items-center gap-2 ${STATUS_CONFIG[status].color} text-white`}
      >
        <div className="w-3 h-3 bg-white rounded-full"></div>
        <h2 className="font-bold text-sm">{customLabel}</h2>{" "}
        {/* Use customLabel */}
        <span className="ml-auto bg-white bg-opacity-30 rounded-full px-2 py-1 text-xs text-black">
          {columnOrders.length}
        </span>
      </div>
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {columnOrders.length > 0 ? (
          columnOrders.map((order) => (
            <GitHubStyleCard
              key={order.id}
              order={order}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              statuses={statuses}
              isSelected={selectedOrders.includes(order.id)}
              onToggleSelect={() => onToggleSelect(order.id)}
              assignMode={assignMode}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center p-4 bg-white rounded border border-dashed">
            {t("status.empty_column")}
          </div>
        )}
      </div>
    </div>
  );
};
