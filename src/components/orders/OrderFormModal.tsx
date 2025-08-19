"use client";

import { useState, useEffect } from "react";
import { Doctor } from "@/src/types/doctor";
import { DoctorService } from "@/src/services/doctorService";
import { FaTimes, FaPlus, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { useLanguage } from "@/src/contexts/LanguageContext";

export const OrderFormModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (form: any) => Promise<void> | void;
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const { t } = useLanguage(); // Add this hook

  const [form, setForm] = useState({
    doctor_id: 0,
    courier_id: 0,
    description: "",
  });

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await DoctorService.getAllDoctors();
        console.log("Fetched doctors:", res); // Check if locationDTO is included
        setDoctors(res);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch deliverers
  // useEffect(() => {
  //   const fetchDeliverers = async () => {
  //     try {
  //       const res = await DelivererService.getAllDeliverers();
  //       setDeliverers(res);
  //     } catch (err) {
  //       console.error("Failed to load deliverers");
  //     } finally {
  //       setLoadingDeliverers(false);
  //     }
  //   };
  //   fetchDeliverers();
  // }, []);

  const handleSubmit = async () => {
    try {
      const selectedDoctor = doctors.find((d) => d.id === form.doctor_id);
      // const selectedCourier = deliverers.find(d => d.id === form.courier_id);

      if (!selectedDoctor) {
        alert(t("order.validation_doctor_deliverer"));
        return;
      }

      // Add this check to ensure locationDTO exists
      if (!selectedDoctor.locationDTO || !selectedDoctor.locationDTO.id) {
        console.error("Doctor locationDTO missing:", selectedDoctor);
        alert("Selected doctor is missing location information");
        return;
      }

      const payload = {
        description: form.description,
        doctor: {
          id: selectedDoctor.id,
          locationDTO: {
            id: selectedDoctor.locationDTO.id, // Access locationDTO, not location
          },
        },
        orderStatus: "NEW_ORDER",
      };

      console.log("Submitting payload:", payload);
      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2 className="text-xl text-[#00b294] font-semibold mb-4 flex items-center gap-2">
          <FaPlus />
          {t("order.create_title")}
        </h2>

        {/* Doctor Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("order.doctor_label")}
          </label>
          {loadingDoctors ? (
            <div className="flex justify-center py-2">
              <FaSpinner className="animate-spin text-blue-500" />
            </div>
          ) : (
            <select
              value={form.doctor_id}
              onChange={(e) =>
                setForm({ ...form, doctor_id: parseInt(e.target.value) || 0 })
              }
              className="w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={0}>{t("order.doctor_placeholder")}</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Deliverer Selection */}
        {/* <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
               {t('order.deliverer_label')}
          </label>
          {loadingDeliverers ? (
            <div className="flex justify-center py-2">
              <FaSpinner className="animate-spin text-green-500" />
            </div>
          ) : (
            <select
              value={form.courier_id}
              onChange={(e) => setForm({ ...form, courier_id: parseInt(e.target.value) || 0 })}
              className="w-full border px-3 py-2 rounded focus:ring-green-500 focus:border-green-500"
            >
              <option value={0}>{t('order.deliverer_placeholder')}</option>
              {deliverers.map((deliverer) => (
                <option key={deliverer.id} value={deliverer.id}>
                  {deliverer.firstName} {deliverer.lastName}
                </option>
              ))}
            </select>
          )}
        </div> */}

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("order.description_label")}
          </label>
          <textarea
            placeholder={t("order.description_placeholder")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-3 py-2 rounded focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        <button
          className="w-full bg-[#00b294] hover:bg-green-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
          onClick={handleSubmit}
        >
          <FaPaperPlane /> {t("order.submit_button")}
        </button>
      </div>
    </div>
  );
};
