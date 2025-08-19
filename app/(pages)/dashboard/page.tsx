import type { Metadata } from "next";
import { EcommerceMetrics } from "@/src/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/src/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/src/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/src/components/ecommerce/StatisticsChart";
import RecentOrders from "@/src/components/ecommerce/RecentOrders";
import KosovoDemographicCard from "@/src/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title: "Dental App",
  description: "This is Dental App",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12">
        <KosovoDemographicCard />
      </div>

      <div className="col-span-12">
        <RecentOrders />
      </div>
    </div>
  );
}
