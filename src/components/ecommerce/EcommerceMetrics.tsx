"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "@/src/icons/index";
import { useLanguage } from "@/src/contexts/LanguageContext";

export const EcommerceMetrics = () => {
  const { t } = useLanguage(); // Get translation function

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Customers Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5  md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <GroupIcon className="text-gray-800 size-6" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">
              {t("metrics.customers")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {t("metrics.positive_change")}
          </Badge>
        </div>
      </div>

      {/* Orders Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
          <BoxIconLine className="text-gray-800" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">{t("metrics.orders")}</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            {t("metrics.negative_change")}
          </Badge>
        </div>
      </div>
    </div>
  );
};
