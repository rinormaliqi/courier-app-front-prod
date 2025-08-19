"use client";
import React from "react";
import DoctorCard from "./DoctorCard";
import type { Doctor } from "@/src/types/doctor";

interface DoctorListProps {
  doctors: Doctor[];
  onEdit: (doc: Doctor) => void;
  onDelete: (id: number) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onEdit,
  onDelete,
}) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {doctors.map((doc) => (
      <DoctorCard
        key={doc.id}
        doctor={doc}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default DoctorList;
