"use client";
import { useEffect, useState } from "react";
import { Doctor, DoctorFormData } from "../types/doctor";
import { useLanguage } from "@/src/contexts/LanguageContext"; // Add this import

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const useDoctors = () => {
  const { t } = useLanguage(); // Add this hook
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v3/doctors`);
      if (!res.ok) throw new Error(t("doctors.error.fetch"));
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      setError(t("doctors.error.fetch")); // Translated error
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorById = async (id: number): Promise<Doctor | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v3/doctors/${id}`);
      if (!res.ok) throw new Error(t(`doctors.error.not_found ${id}`));
      return await res.json();
    } catch {
      setError(t(`doctors.error.not_found${id}`)); // Translated error
      return null;
    }
  };

  const createDoctor = async (doctor: DoctorFormData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v3/doctors/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });
      if (!res.ok) throw new Error(t("doctors.error.create"));
      console.log(error);
      await fetchDoctors();
    } catch (error) {
      console.log(error);
      throw new Error(t("doctors.error.create")); // Translated error
    }
  };

  const updateDoctor = async (id: number, doctor: DoctorFormData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v3/doctors/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...doctor, id }),
      });
      console.log(error);
      if (!res.ok) throw new Error(t("doctors.error.update"));
      await fetchDoctors();
    } catch (error) {
      console.log(error);
      throw new Error(t("doctors.error.update")); // Translated error
    }
  };

  const deleteDoctor = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v3/doctors/${id}/delete`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t("doctors.error.delete"));
      await fetchDoctors();
    } catch (error) {
      console.log(error);
      throw new Error(t("doctors.error.delete")); // Translated error
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
};
