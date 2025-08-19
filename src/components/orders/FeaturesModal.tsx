// components/orders/FeaturesModal.tsx
"use client";

import { useState } from "react";
import {
  FaCog,
  FaTimes,
  FaHistory,
  FaFileAlt,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useLanguage } from "@/src/contexts/LanguageContext";

export type FeatureAction = "makeAllNew" | "generateReport" | "clearAll";

interface FeaturesModalProps {
  onClose: () => void;
  onActionConfirmed: (action: FeatureAction) => void;
}

export const FeaturesModal = ({
  onClose,
  onActionConfirmed,
}: FeaturesModalProps) => {
  const { t } = useLanguage();
  const [pendingAction, setPendingAction] = useState<FeatureAction | null>(
    null,
  );

  const actionConfig = {
    makeAllNew: {
      label: t("make_all_orders_new"),
      icon: <FaHistory className="mr-2" />,
      color: "bg-green-500 hover:bg-green-600",
      confirmText: t("confirm_make_all_new"),
    },
    generateReport: {
      label: t("generate_report"),
      icon: <FaFileAlt className="mr-2" />,
      color: "bg-blue-400 hover:bg-blue-600",
      confirmText: t("confirm_generate_report"),
    },
    clearAll: {
      label: t("clear_all_orders"),
      icon: <FaTrash className="mr-2" />,
      color: "bg-red-500 hover:bg-red-600",
      confirmText: t("confirm_clear_all"),
    },
  };

  const handleConfirm = () => {
    if (pendingAction) {
      onActionConfirmed(pendingAction);
      setPendingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50 p-4">
      {/* Main Features Modal */}
      {!pendingAction && (
        <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            <FaTimes />
          </button>

          <h2 className="text-xl text-[#00b294] font-semibold mb-4 flex items-center gap-2">
            <FaCog />
            {t("additional_features")}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(actionConfig).map(([action, config]) => (
              <button
                key={action}
                className={`${config.color} text-white px-4 py-3 rounded-lg flex items-center transition-colors`}
                onClick={() => setPendingAction(action as FeatureAction)}
              >
                {config.icon}
                {config.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={onClose}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {pendingAction && (
        <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={() => setPendingAction(null)}
          >
            <FaTimes />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-yellow-500 text-2xl" />
            <h2 className="text-xl font-bold">{t("confirm_action")}</h2>
          </div>

          <p className="mb-6 text-gray-600">
            {actionConfig[pendingAction].confirmText}
          </p>

          <div className="flex justify-end gap-3">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              onClick={() => setPendingAction(null)}
            >
              {t("cancel")}
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={handleConfirm}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
