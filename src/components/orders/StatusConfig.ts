export const STATUS_CONFIG = {
  NEW_ORDER: { label: "New Order", color: "bg-blue-200" }, // Initial state
  ASSIGN_TO_PICK_UP: { label: "Pickup Assigned", color: "bg-green-300" }, // First assignment
  ASSIGN_TO_DROP_OFF: { label: "Dropoff Assigned", color: "bg-green-500" }, // Second assignment
  COMPLETED_PICK_UP: { label: "Pickup Completed", color: "bg-green-500" },
  COMPLETED_DROP_OFF: { label: "Dropoff Completed", color: "bg-blue-400" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-400" },
  READY_TO_DELIVER: { label: "Ready to Deliver", color: "bg-green-300" },
  DONE: { label: "Completed", color: "bg-green-700" }, // Final completed state
  CANCELED: { label: "Canceled", color: "bg-red-500" }, // Exception
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;
// type PickupLabels = {
//   ASSIGN_TO_PICK_UP: string;
//   COMPLETED_PICK_UP: string;
//   IN_PROGRESS: string;
// };

// type DropoffLabels = {
//   READY_TO_DELIVER: string;
//   ASSIGN_TO_DROP_OFF: string;
//   COMPLETED_DROP_OFF: string;
// };

export const TOGGLE_LABELS: Record<
  "PICKUP" | "DROPOFF",
  Record<string, string>
> = {
  PICKUP: {
    ASSIGN_TO_PICK_UP: "pickup.assigned",
    COMPLETED_PICK_UP: "pickup.picked_up",
    IN_PROGRESS: "pickup.dropped_off",
  },
  DROPOFF: {
    READY_TO_DELIVER: "dropoff.assigned",
    ASSIGN_TO_DROP_OFF: "dropoff.picked_up",
    COMPLETED_DROP_OFF: "dropoff.dropped_off",
  },
};
