"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DoctorList from "@/src/components/doctors/DoctorList";
import { DoctorFormModal } from "@/src/components/doctors/DoctorFormData";
import { Doctor, DoctorFormData } from "@/src/types/doctor";
import { DoctorService } from "@/src/services/doctorService";
import Loading from "@/src/components/loading/loading";
import {
  NotificationProvider,
  useNotification,
} from "@/src/components/Notification/Notification";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { FaPlus } from "react-icons/fa";

const DoctorPageContent = () => {
  const { t: originalT, loading: languageLoading } = useLanguage();
  const tRef = useRef(originalT);

  // Keep the ref updated with the latest translation function
  useEffect(() => {
    tRef.current = originalT;
  }, [originalT]);

  // Create a stable wrapper for translations
  const t = useCallback((key: string) => tRef.current(key), []);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!languageLoading) {
      fetchDoctors();
    }
  }, [languageLoading]);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await DoctorService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      showNotification(t("notificationFailedLoad"), "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [t, showNotification]);

  const handleCreate = async (form: DoctorFormData) => {
    try {
      const newDoctor = await DoctorService.createDoctor(form);
      // Add new doctor to the beginning of the list
      setDoctors((prev) => [newDoctor, ...prev]);
      showNotification(t("notificationCreateSuccess"), "success");
      await fetchDoctors(); // Refresh the list
    } catch (error) {
      showNotification(t("notificationCreateFailed"), "error");
      console.error(error);
    }
  };

  const handleUpdate = async (id: number, form: DoctorFormData) => {
    try {
      const updatedDoctor = await DoctorService.updateDoctor(id, form);
      // Update doctor in the list
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === id ? updatedDoctor : doc)),
      );
      showNotification(t("notificationUpdateSuccess"), "success");
      await fetchDoctors(); // Refresh the list
    } catch (error) {
      showNotification(t("notificationUpdateFailed"), "error");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (isDeleting || !confirm(t("deleteConfirmation"))) return;

    try {
      setIsDeleting(true);
      await DoctorService.deleteDoctor(id);
      // Remove doctor from the list
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      showNotification(t("notificationDeleteSuccess"), "success");
      await fetchDoctors(); // Refresh the list
    } catch (error) {
      showNotification(t("notificationDeleteFailed"), "error");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setCurrentDoctor(null);
    setIsModalOpen(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (form: DoctorFormData) => {
    if (currentDoctor) {
      await handleUpdate(currentDoctor.id, form);
    } else {
      await handleCreate(form);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
<div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold text-[#00b294]">
    {t("doctorsManagement")}
  </h1>
  <button
    className="bg-[#00b294] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
    onClick={() => openCreateModal()}
  >
    <FaPlus /> {t("addDoctor")}
  </button>
</div>


      {isLoading ? (
        <div className="flex justify-center mt-20">
          <Loading />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t("noDoctors")}
          </h3>
          <p className="mt-1 text-gray-500">{t("getStarted")}</p>
          <button
            className="bg-[#00b294] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={() => openCreateModal()}
          >
            <FaPlus /> {t("addDoctor")}
          </button>
        </div>
      ) : (
        <>
          {/* <button
            className="bg-[#00b294] hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            onClick={() => openCreateModal()}
          >
            <FaPlus /> {t("addDoctor")}
          </button> */}
          <DoctorList
            doctors={doctors}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </>
      )}

      {isModalOpen && (
        <DoctorFormModal
          key={currentDoctor?.id || "create"} // Reset form state when doctor changes
          doctor={currentDoctor}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default function DoctorsPage() {
  return (
    <NotificationProvider>
      <DoctorPageContent />
    </NotificationProvider>
  );
}
