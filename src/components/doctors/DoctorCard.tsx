"use client";
import React from "react";
import { Card, H3, Paragraph, XStack, YStack, Button } from "tamagui";
import { AngleDownIcon, PencilIcon, TrashBinIcon } from "@/src/icons/index";
import type { Doctor } from "@/src/types/doctor";

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doc: Doctor) => void;
  onDelete: (id: number) => void;
}

const DoctorCard = ({ doctor, onEdit, onDelete }: DoctorCardProps) => {
  const fullName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();
  const location = doctor.locationDTO?.formattedAddress || doctor.address || "";

  return (
    <Card elevate bordered>
      <Card.Header>
        <XStack alignItems="center" space="$3">
          <Card.Background
            borderRadius="$3"
            width={56}
            height={56}
            backgroundColor="#D0F0C0"
          />

          <YStack flex={1}>
            <H3 col="#00b294">{fullName}</H3>
            <Paragraph col="white" theme="alt2">
              ID: {doctor.id}
            </Paragraph>
          </YStack>
        </XStack>

        <YStack space="$2" mt="$3">
          <XStack alignItems="center" space="$2">
            <AngleDownIcon size={16} />
            <Paragraph theme="alt1" numberOfLines={2}>
              {location}
            </Paragraph>
          </XStack>

          <Paragraph theme="alt2" fontSize="$1">
            Created: {new Date(doctor.createdAt).toLocaleDateString()}
          </Paragraph>
        </YStack>
      </Card.Header>

      <Card.Footer>
        <XStack flex={1} />
        <XStack space="$2">
          <Button
            size="$2"
            icon={PencilIcon}
            onPress={() => onEdit(doctor)}
            theme="blue"
          />
          <Button
            size="$2"
            icon={TrashBinIcon}
            onPress={() => onDelete(doctor.id)}
            theme="red"
          />
        </XStack>
      </Card.Footer>
    </Card>
  );
};

export default DoctorCard;
