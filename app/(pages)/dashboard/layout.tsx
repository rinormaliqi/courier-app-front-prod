"use client";

import { useSidebar } from "@/src/contexts/SidebarContext";
import AppHeader from "@/src/components/dashboardUI/AppHeader";
import AppSidebar from "@/src/components/dashboardUI/AppSidebar";
import Backdrop from "@/src/components/dashboardUI/Backdrop";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="fixed lg:relative z-30">
        <AppSidebar />
      </div>

      {/* Backdrop for mobile sidebar */}
      <Backdrop />

      {/* Main Content Area */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* 🔔 Development Banner */}
        <div className="w-full bg-yellow-400 text-white text-center py-2 text-sm font-bold z-50 sticky top-0">
          🚧 Ky website eshte ende ne zhvillim e siper, per cdo problem eventual
          mos hezitoni te kontaktoni! 🚧
        </div>
        {/* Header */}
        <div className="sticky top-0 z-20">
          <AppHeader />
        </div>

        {/* Responsive Page Content */}
        <div className="p-4 w-full max-w-screen-2xl mx-auto">
          <div className="bg-none rounded-xl shadow-sm p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
