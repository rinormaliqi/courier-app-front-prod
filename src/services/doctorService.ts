import axios from "axios";
import { Doctor, DoctorFormData } from "../types/doctor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v3/doctors`, // no extra slash here
  headers: {
    "Content-Type": "application/json",
  },
});

export const DoctorService = {
  async getAllDoctors(): Promise<Doctor[]> {
    const { data } = await axiosInstance.get(""); // NOT "/"
    return data;
  },

  async getDoctorById(id: number): Promise<Doctor> {
    const { data } = await axiosInstance.get(`/${id}`);
    return data;
  },
  async createDoctor(doctor: DoctorFormData): Promise<Doctor> {
    const { locationDTO, ...rest } = doctor;
    const sanitizedLocation = locationDTO
      ? {
          latitude: locationDTO.latitude,
          longitude: locationDTO.longitude,
          formattedAddress: locationDTO.formattedAddress,
          city: locationDTO.city,
          postalCode: locationDTO.postalCode,
        }
      : undefined;

    const payload = {
      ...rest,
      locationDTO: sanitizedLocation,
    };

    const { data } = await axiosInstance.post("/create", payload);
    return data;
  },

  async updateDoctor(id: number, doctor: DoctorFormData): Promise<Doctor> {
    const payload = { ...doctor, id };
    const { data } = await axiosInstance.put(`/${id}/update`, payload);
    return data;
  },

  async deleteDoctor(id: number): Promise<void> {
    await axiosInstance.delete(`/${id}/delete`);
  },
};
