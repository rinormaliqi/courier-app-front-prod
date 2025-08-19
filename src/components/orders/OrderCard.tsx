import { Order } from "@/src/types/models";
import { FaTrash } from "react-icons/fa";

const getStatusClass = (status: string) => {
  switch (status) {
    case "NEW_ORDER":
      return "bg-yellow-100 text-yellow-800";
    case "ASSIGNED":
      return "bg-blue-100 text-blue-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const OrderCard = ({
  order,
  onDelete,
}: {
  order: Order;
  onDelete: (id: number) => void;
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex justify-between items-center">
      <h2 className="font-semibold text-blue-700">Order #{order.id}</h2>
      <div className="flex gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(order.orderStatus)}`}
        >
          {order.orderStatus.replace("_", " ")}
        </span>
        <button
          onClick={() => onDelete(order.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
    </div>
    <div className="mt-4 space-y-3">
      <p>
        <strong>Description:</strong> {order.description}
      </p>
      <p>
        <strong>Address:</strong> {order.doctor.address}
      </p>
      <p>
        <strong>Doctor:</strong> {order.doctor.firstName}{" "}
        {order.doctor.lastName}
      </p>
      <p>
        <strong>Courier:</strong>{" "}
        {order.courier
          ? `${order.courier.firstName} ${order.courier.lastName}`
          : "Not assigned"}
      </p>
    </div>
  </div>
);
