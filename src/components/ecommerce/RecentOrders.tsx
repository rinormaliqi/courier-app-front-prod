"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useLanguage } from "@/src/contexts/LanguageContext";

interface DentalOrder {
  id: number;
  product: string;
  courier: string;
  address: string;
  price: string;
  status: "Delivered" | "Pending" | "Canceled" | "Processing";
  image: string;
}

// Updated dental-focused order data
const dentalOrders: DentalOrder[] = [
  {
    id: 1,
    product: "Electric Toothbrush Pro",
    courier: "DHL Express",
    address: "123 Dental St, Prishtina",
    price: "$89.99",
    status: "Delivered",
    image: "/orders/dentist.jpg",
  },
  {
    id: 2,
    product: "Professional Whitening Kit",
    courier: "UPS Dental",
    address: "456 Smile Ave, Prizren",
    price: "$129.99",
    status: "Processing",
    image: "/orders/dentist2.jpg",
  },
  {
    id: 3,
    product: "Dental Floss Dispenser",
    courier: "FedEx Oral Care",
    address: "789 Hygiene Blvd, Mitrovica",
    price: "$24.99",
    status: "Pending",
    image: "/orders/dentist3.jpg",
  },
  {
    id: 4,
    product: "Water Dental Flosser",
    courier: "DHL Express",
    address: "101 Gum Care Rd, Peja",
    price: "$59.99",
    status: "Canceled",
    image: "/orders/dentist4.jpg",
  },
  {
    id: 5,
    product: "Orthodontic Wax",
    courier: "UPS Dental",
    address: "202 Braces Lane, Gjilan",
    price: "$14.99",
    status: "Delivered",
    image: "/orders/dentist5.jpg",
  },
];

export default function DentalOrdersTable() {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {t("dental_orders_title")}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800">
            {t("dental_orders_filter_button")}
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800">
            {t("dental_orders_see_all_button")}
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs"
              >
                {t("dental_orders_product_table_headers")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs"
              >
                {t("dental_orders_table_headers_courier")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs"
              >
                {t("dental_orders_table_headers_address")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                {t("dental_orders_table_headers_price")}
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs "
              >
                {t("dental_orders_table_headers_status")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {dentalOrders.map((order) => (
              <TableRow key={order.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <Image
                        width={50}
                        height={50}
                        src={order.image}
                        className="h-[50px] w-[50px] object-cover"
                        alt={order.product}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm ">
                        {order.product}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm">
                  {order.courier}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm max-w-[200px] truncate">
                  {order.address}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm font-medium">
                  {order.price}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm">
                  <Badge
                    size="sm"
                    color={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Pending"
                          ? "warning"
                          : order.status === "Processing"
                            ? "info"
                            : "error"
                    }
                  >
                    {t(`status.${order.status.toLowerCase()}`) || order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
